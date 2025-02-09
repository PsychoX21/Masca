import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Navbar.css';
import { useNavigate } from 'react-router-dom';


export const Navbar = (props) => {
    let homestyle={};
    let mapstyle={};
    let profilestyle={};
    
    const highlight={
        background: " #FEFAE0",
        color:" #133215"
    }

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem("auth_token");
        const csrftoken = localStorage.getItem("csrftoken");

        try {
            await fetch("http://127.0.0.1:8000/logout/", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${token}`,
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrftoken
                },
                credentials: "include",
            });

            localStorage.removeItem("user");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("csrftoken");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const admincontrol = (usertype) => {
        if (!usertype) return null;

        if (usertype === "admin") {
            return (
                <li className="admintab nav-item" style={props.page==="admin"? highlight: {}}>
                    <Link className="nav-link" to="http://127.0.0.1:8000/admin/login/?next=/admin/">Admin</Link>
                </li>
            );
        }
        return null;
    }

    return (

        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="hometab nav-item" style={props.page==="home"? highlight: {}}>
                                <Link className="nav-link" aria-current="page" to="/home">Home</Link>
                            </li>
                            <li className="maptab nav-item" style={props.page==="map"? highlight: {}}>
                                <Link className="nav-link" to="/map">Map</Link>
                            </li>
                            <li className="profiletab nav-item" style={props.page==="profile"? highlight: {}}>
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                            <li className="logout nav-item" style={props.page==="logout"? highlight: {}}>
                                <Link className="nav-link" to="/login" onClick={() => {
                                    handleLogout();
                                }}>Logout</Link>
                            </li>
                            {user && admincontrol(user.user_type)}

                        </ul>
                        {props.searchbar && (
                            <form className="d-flex" role="search">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                />
                                <button className="btn btn-outline-success" type="submit">
                                    Search
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}

Navbar.defaultProps={
    searchbar: false,
}

Navbar.propTypes = {
    searchbar: PropTypes.bool,
    page: PropTypes.string.isRequired,
}