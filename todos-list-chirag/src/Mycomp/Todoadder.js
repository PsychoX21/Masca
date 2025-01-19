import React, {useState} from 'react'


export const Todoadder = () => {
  const Handlechange =(event)=>{
    setText(event.target.value)
  }

  const addtodo =()=>{
    let todotext = text
    console.log(todotext)
  }

  const [text, setText] = useState('Enter To-Do here')
  return (
    <>
    <div className="container">
    <h1>Add a To-Do</h1>
    <input className="form-control mb-3" defaultValue={"Enter To-Do Here"}></input>
    <button className="btn btn-primary mb-4" onClick={addtodo}>Add To-Do</button>
    </div>
    </>
  )
}
