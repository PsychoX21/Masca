// import logo from './logo.svg';
// import './App.css';
import Header from './Mycomp/Header';
import { Todos } from './Mycomp/Todos';
import { Footer } from './Mycomp/Footer';
import { Todoadder } from './Mycomp/Todoadder';
import { useState } from 'react';

function App() {
  
  const [todos, setTodos] = useState([]);

  const Addtodo =(id, title, text)=>{
    setTodos([...todos, {id: id, title:title, text:text}])
  }

  const onDelete = (remove) =>{
    let updatedTodos = todos.filter((item) => item.id !== remove);
    setTodos(updatedTodos);
  }
  return (
    // my close in tags can be simple opening closing tag
    <>
    <Header title="To-Do's List" searchbar={false}/>
    <Todoadder addtodo={Addtodo}/>
    <Todos todos = {todos} onDelete={onDelete}/>
    <Footer/>
    </>
  );
}


export default App;
