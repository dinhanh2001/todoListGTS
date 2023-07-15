
import "./App.css";
import DisplayToDo from "./components/DisplayTodoList"
function App() {
  return (
    <div className="App">
      <div>
        <h1>Todos</h1>
        <DisplayToDo />
      </div>
    </div>
  );
}

export default App;
