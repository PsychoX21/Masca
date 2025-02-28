// import logo from './logo.svg';
// import './App.css';
import Header from './Mycomp/Header';
import { Todos } from './Mycomp/Todos';
import { Footer } from './Mycomp/Footer';
import { Todoadder } from './Mycomp/Todoadder';
import { About } from './Mycomp/About';
import { useState , useEffect} from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  
  let inittodo;
  if(localStorage.getItem("Todos")===null){
    inittodo=[];
  }
  else{
    inittodo=JSON.parse(localStorage.getItem("Todos"))
  }
  
  const [todos, setTodos] = useState(inittodo);

  const Edittodo = (id, updatedTitle, updatedText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: updatedTitle, text: updatedText } : todo
      )
    );
  };
  
  const Addtodo =(title, text)=>{
    let id;
    if(todos.length === 0){
      id = 1;
    }
    else{
      id = todos[todos.length-1].id+1
    }
    setTodos([...todos, {id: id, title:title, text:text}])
  }
  
  const onDelete = (remove) =>{
    let updatedTodos = todos.filter((item) => item.id !== remove);
    setTodos(updatedTodos);
  }

  useEffect(() => {
    localStorage.setItem("Todos", JSON.stringify(todos))
    
  }, [todos])
  
  
  const router = createBrowserRouter([
    {
      path:"/",
      element: (
        <>
        <Header title="To-Do's List" searchbar={false}/>
        <Todoadder addtodo={Addtodo}/>
        <Todos todos = {todos} onDelete={onDelete} edittodo={Edittodo}/>
        <Footer/>
        </>
      )
    },
    {
      path:"/about",
      element: (
        <>
        <Header title="To-Do's List" searchbar={false}/>
        <About/>
        </>
      )
    }
  ])
  return (
    // my close in tags can be simple opening closing tag
    <>
    <RouterProvider router = {router}/>
    </>
  );
}


export default App;
