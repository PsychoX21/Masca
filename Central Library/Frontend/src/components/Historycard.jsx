import React from 'react'
import './ProfilePage.css'

export const Historycard = ({ book_name, cover_page, borrow_date, return_date }) => {
  return (
    <div className="historycard">
      <div className="bookimg"><img src={cover_page || "src/assets/bookimg.png"} alt="BOOKimg" />
      </div>
      <div className="bookinfo">
        <div>{book_name}</div>
        <div>Borrowed Date: {borrow_date}</div>
        <div>Returned Date: {return_date}</div>
      </div>
    </div>
  )
}
