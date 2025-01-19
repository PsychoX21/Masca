// import logo from './logo.svg';
// import './App.css';
import Header from './Mycomp/Header';
import { Todos } from './Mycomp/Todos';
import { Footer } from './Mycomp/Footer';
import { Todo } from './Mycomp/TodoItem';
import { Todoadder } from './Mycomp/Todoadder';
import { useState } from 'react';

function App() {
  const [todos, setTodos] = useState(["Todo1", "Todo2", "Todo3"]);
  const onDelete = (remove) =>{
    console.log("Hi Dlt")
    const updatedTodos = todos.filter((_, index) => index !== remove);
    setTodos(updatedTodos);
  }
  return (
    // my close in tags can be simple opening closing tag
    <>
    <Header title="To-Do's List" searchbar={false}/>
    <Todoadder/>
    <Todos todos = {todos} onDelete={onDelete}/>
    <Footer/>
    </>
  );
}


export default App;
