import React from 'react'
import { TodoItem } from './TodoItem'

export const Todos = (props) => {
  return (
    <>
    <div className="container">
    <h1>TO-DO's</h1>
    {props.todos.length > 0 ? (
          props.todos.map((todo, index) => (
            <TodoItem key={index} todo={todo} onDelete = {()=> props.onDelete(index)}/> 
          ))
        ) : (
          <p>No todos to display!</p>
        )}
    </div>
    </>
  )
}
