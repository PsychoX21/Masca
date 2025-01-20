import React from 'react'
import { useState } from 'react'
export const TodoItem = (props) => {

  // let idstyling={
  //   display:"inline-flex",
  //   position: "absolute",
  //   top: "10px",
  //   right: "20px"
  // }

  // let divstyle={
  //   position:"relative"
  // }

  const edittodo = (e) =>{
    e.preventDefault();
    props.edittodo(props.todo.id, title, text)
  }


  let [text, Newtext] = useState(props.todo.text)
  let [title, Newtitle] = useState(props.todo.title)
  return (
    <>
    <div className='container border my-2'>
    <textarea className='border-0 mt-3 h4' rows={1} value={title} onChange={(e)=>Newtitle(e.target.value)}></textarea>
    {/* <span  style={idstyling}>{props.todo.id}</span> */}
    <textarea className='container' rows={8} value={text} onChange={(e)=>Newtext(e.target.value)}></textarea>
    <button className="btn btn-danger mb-3" onClick={props.onDelete}>Delete</button>
    <button className="btn btn-primary mx-3 mb-3" onClick={edittodo}>Save Changes</button>
    </div>
    </>
  )
}

