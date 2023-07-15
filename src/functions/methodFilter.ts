export interface todoTypes {
  title: string;
  isActive: boolean;
  __typename: string;
  id: string;
  createdAt: string;
  
}
interface listTodoApi {
  listTodo:Array<todoTypes>
}
export function SortByDate(array:listTodoApi) {
  if (array?.["listTodo"]) {
    let abc = [...array?.["listTodo"]];
    return abc.sort((a, b) => {
      return new Date(a["createdAt"]).getTime() > new Date(b["createdAt"]).getTime() ? -1 : 1;
    });
  } else {
    return []
  }
}
