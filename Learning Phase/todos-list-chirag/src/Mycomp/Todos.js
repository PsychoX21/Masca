import React from 'react'
import { TodoItem } from './TodoItem'

export const Todos = (props) => {
  return (
    <>
    <div className="container">
    <h1>TO-DO's</h1>
    {props.todos.length > 0 ? (
          props.todos.map((todo) => (
            <TodoItem key = {todo.id} todo={todo} onDelete = {()=> props.onDelete(todo.id)} edittodo={props.edittodo}/>
          ))
        ) : (
          <p>No todos to display!</p>
        )}
    </div>
    </>
  )
}
