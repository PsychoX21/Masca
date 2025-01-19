import React, { useState } from 'react'


export const Todoadder = (props) => {

  let[id,setId] = useState(0)
  let[title,setTitle] = useState("TITLE")
  let[text,setText] = useState("TEXT")
  const addtodo = (e) =>{
    e.preventDefault();
    props.addtodo(id, title, text);
  }


  return (
    <>
      <div className="container border my-3">
        <h1>Add a To-Do</h1>
        <form>
          <div className="mb-3">
            <input className="form-control" value={title} onChange={(e)=>setTitle(e.target.value)} />
          </div>
          <div className="mb-3">
            <input className="form-control" value={text} onChange={(e)=>setText(e.target.value)} />
          </div>
          <div className="mb-3">
            <input type='number' className="form-control" value={id} onChange={(e)=>setId(e.target.value)}/>
            <div className="form-text">DO NOT ASSIGN SAME ID TO ANY TWO TO-DOs.</div>
          </div>
          <button className="btn btn-primary mb-4" onClick={addtodo}>Add To-Do</button>
        </form>
      </div>
    </>
  )
}
