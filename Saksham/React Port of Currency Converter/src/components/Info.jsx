import React from "react";
import "./Info.css";

const Info = ({ rate, timestamp }) => {
    return (
        <section className="info">
            <div className="rates"> {rate} </div>
            <div className="timestamp"> {timestamp} </div>
        </section>
    );
};

export default Info;