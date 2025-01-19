// import logo from './logo.svg';
// import './App.css';
import Header from './Mycomp/Header';
import { Todos } from './Mycomp/Todos';
import { Footer } from './Mycomp/Footer';
import { Todo } from './Mycomp/TodoItem';
import { Todoadder } from './Mycomp/Todoadder';

function App() {
  return (
    // my close in tags can be simple opening closing tag
    <>
    <Header title="To-Do's List" searchbar={false}/>
    <Todoadder/>
    <Todos/>
    <Footer/>
    </>
  );
}


export default App;
