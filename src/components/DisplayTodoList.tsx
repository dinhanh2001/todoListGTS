import { useQuery, gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { SortByDate } from "../functions/methodFilter";
import { todoTypes } from "../functions/methodFilter";
import "./DisplayTodoList.css";
const GET_Todo = gql`
  query ListTodo {
    listTodo {
      id
      title
      isActive
      createdAt
    }
  }
`;
const ADD_Todo = gql`
  mutation ($title: String!) {
    createTodo(input: { title: $title, isActive: false }) {
      id
      title
      isActive
      createdAt
    }
  }
`;
const Delete_Todo = gql`
  mutation ($id: String!) {
    deleteTodo(id: $id)
  }
`;
const Update_TOdo = gql`
  mutation ($id: String!, $isActive: Boolean!, $title: String!) {
    updateTodo(input: { isActive: $isActive, id: $id, title: $title }) {
      id
    }
  }
`;
function DisplayToDo() {
  let { loading, error, data, refetch } = useQuery(GET_Todo);
  const [delete_Todo] = useMutation(Delete_Todo);
  const [updateTodo] = useMutation(Update_TOdo);
  const [add_todo] = useMutation(ADD_Todo);
  const [title, setTitle] = useState<string>("");
  const [loadToDo, setLoadTodo] = useState<boolean>(loading);
  const [dataTodo, setDataTodo] = useState(SortByDate(data));
  useEffect(() => {
    setDataTodo(SortByDate(data));
  }, [loadToDo, loading]);
  const addTodo = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (title == "") {
        alert("Chưa nhập tiêu đề ");
      } else {
        setTitle("");
        await add_todo({ variables: { title: title } });
        await refetch();
        setLoadTodo(!loadToDo);
      }
    }
  };

  const updateTodoList = async (e: React.ChangeEvent<HTMLInputElement>, el: todoTypes) => {
    await updateTodo({
      variables: {
        id: el["id"],
        isActive: e.target.checked,
        title: el["title"],
      },
    });
    await refetch();
    setLoadTodo(!loadToDo);
  };

  const deleteTodoList = async (el: todoTypes) => {
    await delete_Todo({ variables: { id: el["id"] } });
    await refetch();
    setLoadTodo(!loadToDo);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className="boxmain">
      <input
        type="text"
        placeholder="What needs to be done ?"
        id="input-title"
        value={title}
        onKeyPress={(event) => {
          addTodo(event);
        }}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      />
      {dataTodo &&
        dataTodo.map((el: todoTypes, id: number) => (
          <div
            key={el["id"]}
            className="box-list"
            style={{
              backgroundColor: id % 2 == 0 ? "#fffaed" : "#f5f5f5",
            }}
          >
            <div className="listTodo">
              <input
                type="checkbox"
                checked={el.isActive}
                onChange={(e) => {
                  updateTodoList(e, el);
                }}
                value={el["title"]}
              />
              <h3
                {...(el.isActive
                  ? {
                      style: {
                        textDecoration: "line-through",
                        fontWeight: "normal",
                      },
                    }
                  : { style: { fontWeight: "normal" } })}
              >
                {el["title"]}
              </h3>
            </div>
            <div>
              <button
                type="button"
                className="btndelete"
                onClick={() => {
                  deleteTodoList(el);
                }}
              >
                DELETE
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default DisplayToDo;
