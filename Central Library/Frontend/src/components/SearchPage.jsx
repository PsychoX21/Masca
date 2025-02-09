import React, { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import { FaSearch, FaFilter } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import './SearchPage.css'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const FilterDropdown = styled.div`
  position: absolute;
  top: 18%;
  right: 5%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  display: ${({ $show }) => ($show ? "block" : "none")};
`;

export const SearchPage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [searchType, setSearchType] = useState("book_name");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState([]);
  const [Books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchedRecent, setFetchedRecent] = useState(false);

  useEffect(() => {
    const csrftoken = localStorage.getItem("csrftoken");
    const token = localStorage.getItem("auth_token");

    fetch("http://127.0.0.1:8000/api/books/", {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken
      },
      credentials: "include",
    })
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching books:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (query) {
      let filteredResults = Books.filter((book) => book[searchType].toLowerCase().includes(query.toLowerCase()));

      if (sortBy === "date_published") {
        filteredResults.sort((a, b) => b.published_year - a.published_year);
      } else if (sortBy === "name") {
        filteredResults.sort((a, b) => a.book_name.localeCompare(b.book_name));
      } else if (sortBy === "author") {
        filteredResults.sort((a, b) => a.author_name.localeCompare(b.author_name));
      }

      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query, searchType, sortBy, Books]);

  useEffect(() => {
    if (user && query === "" && !fetchedRecent) {
      const token = localStorage.getItem("auth_token");
      const csrftoken = localStorage.getItem("csrftoken");

      axios.get("http://127.0.0.1:8000/get-recent-searches/", {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        credentials: 'include',
      })
        .then((response) => {
          setRecentSearches(response.data.recent_searches || []);
          setFetchedRecent(true);
        })
        .catch((error) => {
          console.error('Error fetching recent searches:', error);
        });
    } else if (query !== "") {
      setFetchedRecent(false);
    }
  }, [user, query]);

  const updateRecentSearches = (bookName) => {
    if (!user) return;

    const token = localStorage.getItem("auth_token");
    const csrftoken = localStorage.getItem("csrftoken");

    axios.post("http://127.0.0.1:8000/save-recent-search/", {
      book_name: bookName
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
        'X-CSRFToken': csrftoken
      },
      credentials: 'include',
    })
      .then(response => {
        setRecentSearches(response.data.recent_searches || []);
      })
      .catch(error => console.error("Error saving recent search:", error));
  }

  const onSearch = () => {
    if (!query) return;
    updateRecentSearches(query);
    setResults(Books.filter((book) => book[searchType].toLowerCase().includes(query.toLowerCase())));
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      setResults(Books.filter((book) => book[searchType].toLowerCase().includes(e.target.value.toLowerCase())));
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (bookName, ID) => {
    updateRecentSearches(bookName);
    navigate(`/books?id=${encodeURIComponent(ID)}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='searchpage'>
      <Navbar page="search" />
      
      <div className='search-area'>
        <div className="search-container">
          <div className="search-icon-container">
            <FaSearch />
            <div className='seperator'></div>
          </div>

          <input className='search-input'
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search books..."
          />

          <button className='filter-button' onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <FaFilter />
          </button>

          <FilterDropdown $show={isFilterOpen}>
            <label className='filter-label'>Sort By</label>
            <select className='filter-select' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date_published">Date Published</option>
              <option value="name">Name</option>
              <option value="author">Author</option>
            </select>

            <label className='filter-label'>Search By</label>
            <select className='filter-select' value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="book_name">Book Name</option>
              <option value="author_name">Author Name</option>
            </select>
          </FilterDropdown>

          <button className='search-button' onClick={onSearch}>Search</button>
        </div>

        <div className="results-container">
          {query === "" && recentSearches.length > 0 && (
            <div className="recent-searches">
              <h3 className='recent-heading'>Your Recent Searches</h3>
              {recentSearches.map((search, index) => (
                <div className="recent-item" key={index} onClick={() => setQuery(search)}>{search}</div>
              ))}
            </div>
          )}

          {query !== "" && results.length === 0 ? (
            <p>No results found</p>
          ) : (
            results.map((book, index) => (
              <div className="result-item" key={index} onClick={() => handleResultClick(book.book_name, book.id)}>
                <img src={book.cover_page} alt="Book Cover" className="book-image" />
                <div className="book-details">
                  <div className="book-title">
                    {book.book_name} - <span className="author">{book.author_name}</span>
                  </div>
                  <div className="book-footer">
                    <span className="published-year">Published Year: {book.published_year}</span>
                    <HiOutlineArrowRight className="arrow-icon" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
