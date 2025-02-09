import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import './BookPage.css'

export const BookPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [borrowed, setBorrowed] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchBookDetails();
  }, [id]);
  
  const fetchBookDetails = async () => {
    const token = localStorage.getItem("auth_token");
    const csrftoken = localStorage.getItem("csrftoken");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Token ${token}`,
          "X-CSRFToken": csrftoken
        },
        credentials: 'include',
      });
      const data = await response.json();
      setBook(data);

      const storedUser = localStorage.getItem("user");
      const username = storedUser ? JSON.parse(storedUser).username : null;
      if (username) {
        const userRating = data.ratings.find(r => r.username === username);
        if (userRating) {
          setRating(userRating.score);
        }
        const userBorrowed = data.borrow_history.some(h => h.username === username && !h.return_date);
        setBorrowed(userBorrowed);
      }
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (newRating) => {
    const storedUser = localStorage.getItem("user");
    const username = storedUser ? JSON.parse(storedUser).username : null;
    if (!username) {
      alert('Please log in to rate the book.');
      return;
    }

    const token = localStorage.getItem("auth_token");
    const csrftoken = localStorage.getItem("csrftoken");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/rate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Token ${token}`,
          "X-CSRFToken": csrftoken
        },
        credentials: 'include',
        body: JSON.stringify({ username, score: newRating })
      });

      if (response.ok) {
        fetchBookDetails();
      } else {
        console.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const submitReview = async () => {
    const storedUser = localStorage.getItem("user");
    const username = storedUser ? JSON.parse(storedUser).username : null;
    if (!username) {
      alert('Please log in to submit a review.');
      return;
    }

    const token = localStorage.getItem("auth_token");
    const csrftoken = localStorage.getItem("csrftoken");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/review/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Token ${token}`,
          "X-CSRFToken": csrftoken
        },
        credentials: 'include',
        body: JSON.stringify({ review }),
      });


      if (response.ok) {
        setReview('');
        fetchBookDetails();
      } else {
        const data  = await response.json()
        alert(data.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleCheckIn = async () => {
    const storedUser = localStorage.getItem("user");
    const username = storedUser ? JSON.parse(storedUser).username : null;
    if (!username) {
      alert('Please log in to borrow this book.');
      return;
    }

    const token = localStorage.getItem("auth_token");
    const csrftoken = localStorage.getItem("csrftoken");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/take/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Token ${token}`,
          "X-CSRFToken": csrftoken
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setBorrowed(true);
        fetchBookDetails();
      } else {
        alert(data.error || 'Failed to borrow book');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleReturn = async () => {
    const storedUser = localStorage.getItem("user");
    const username = storedUser ? JSON.parse(storedUser).username : null;
    if (!username) {
      alert('Please log in to return this book.');
      return;
    }

    const token = localStorage.getItem("auth_token");
    const csrftoken = localStorage.getItem("csrftoken");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${id}/return/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Token ${token}`,
          "X-CSRFToken": csrftoken
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setBorrowed(false);
        fetchBookDetails();
      } else {
        alert(data.error || 'Failed to return book');
      }
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  if (!id) return <div className='error-message'>No book ID provided</div>
  if (loading) return <div className='loading-message'>Loading...</div>
  if (!book) return <div className='error-message'>Book not found</div>

  return (
    <div className="book-page">
      <Navbar page="book"/>
      <div className="book-container">
          <div className="book-cover">
            <img src={book.book.cover_page} alt="Book Cover"/>
          </div>
          <div className="book-details">
              <h1>{book.book.book_name}</h1>
              <p><strong>Author:</strong> {book.book.author_name}</p>
              <p><strong>Subject:</strong> {book.book.subject}</p>
              <p><strong>Published Year:</strong> {book.book.published_year}</p>
              <p><strong>Available Copies:</strong> {book.book.available_copies}</p>
              <p><strong>Location:</strong> {book.book.location}</p>        
          </div>
      </div>
      <div className="bookbuttons">
          <button className='onlybuttonstyle'>Rated: {book.book.avg_rating}</button>
          {borrowed ? (
            <button onClick={handleReturn}>Return</button>
          ) : (
            <button onClick={handleCheckIn}>Check-In</button>
          )}
      </div>

      <div className='bookreview-section'>
        <div className="rating-section">
          <p><b>Rate this book:</b></p>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''} ${star <= hover ? 'hovered' : ''}`}
                onClick={() => {
                  setRating(star);
                  submitRating(star);
                }}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="bookreview-self">
          <textarea placeholder="Write your review..." value={review} rows='3' onChange={(e) => setReview(e.target.value)}></textarea>        
          <button className="submit-review" onClick={submitReview}>Submit Review</button>
        </div>

        <div className="reviews-section">
          <ul className='review-list'>
            {book.reviews.map((review, index) => (
              <li key={index} className='single-review'>
                <p><strong>{review.username}:</strong> {review.review_text}</p>
              </li>
            ))}
          </ul>
        </div>
          
      </div>
    </div>
  );
};