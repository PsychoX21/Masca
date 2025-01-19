import React from 'react'

export const TodoItem = (props) => {

  let idstyling={
    display:"inline-flex",
    position: "absolute",
    top: "10px",
    right: "20px"
  }

  let divstyle={
    position:"relative"
  }

  return (
    <>
    <div className='container border my-2' style={divstyle}>
    <h4 className='mt-3'>{props.todo.title}</h4>
    <span  style={idstyling}>{props.todo.id}</span>
    <textarea className='container' rows={8} defaultValue={props.todo.text}></textarea>
    <button className="btn btn-danger mb-3" onClick={props.onDelete}>Delete</button>
    </div>
    </>
  )
}

