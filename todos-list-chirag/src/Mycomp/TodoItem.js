import React from 'react'

export const TodoItem = (props) => {
  return (
    <>
    <div className='container'>
    <textarea className='container mt-3' rows={8}></textarea>
    <button className="btn btn-danger mb-3">Delete</button>
    </div>
    </>
  )
}
