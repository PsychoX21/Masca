import React, { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import './ProfilePage.css'
import { Historycard } from './Historycard'

export const ProfilePage = (props) => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchUserBorrowHistory = async () => {
      const token = localStorage.getItem("auth_token");
      const csrftoken = localStorage.getItem("csrftoken");

      try {
        const response = await fetch("http://127.0.0.1:8000/api/user-borrow-history/", {
          method: 'GET',
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        } else {
          console.error("Failed to fetch user borrow history");
        }
      } catch (error) {
        console.error("Error fetching user borrow history:", error);
      }
    };

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchUserBorrowHistory();
  }, []);
  
  if (!user) {
    return <p>Loading...</p>;
  }
  
  return (
    <div className='profpage'>
      <Navbar page="profile" />
      <div className="historycont">
        <h2 className='historyheading'> Your Reading History</h2>
        <div className="history">
          {history.length > 0 ? (
            history.map((entry, index) => (
              <Historycard
                key={index}
                book_name={entry.book_name}
                cover_page={entry.cover_page}
                borrow_date={entry.borrow_date}
                return_date={entry.return_date}
              />
            ))
          ) : (
            <p>No borrowing history found.</p>
          )}
        </div>

      </div>
      <div className="infocont">
        <img src={user.profile_photo} alt="DP" className="dp" />
        <div className="info">
          <div>{user.Name}</div>
          <div className="underline"></div>
          <div>{user.username}</div>
          <div className="underline"></div>
          <div>{user.user_type}</div>
          <div className="underline"></div>
          <div>{user.Address}</div>
          <div className="underline"></div>
        </div>
      </div>
    </div>
  )
}
