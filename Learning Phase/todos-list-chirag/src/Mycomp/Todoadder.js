import React, { useState } from 'react'


export const Todoadder = (props) => {

  let[title,setTitle] = useState("TITLE")
  let[text,setText] = useState("TEXT")
  const addtodo = (e) =>{
    e.preventDefault();
    if(title==="" && text===""){
      alert("Title and Text both can't be blank")
    }
    else{
    props.addtodo(title, text);
    setTitle("TITLE")
    setText("TEXT")
    }
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
          <button className="btn btn-primary mb-4" onClick={addtodo}>Add To-Do</button>
        </form>
      </div>
    </>
  )
}
