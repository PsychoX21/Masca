import React from 'react';
import './Selectors.css';

export const CurrencySelector = ({ label, id, options, value, onChange, isReadOnly = false }) => {
  if (!options || options.length === 0) {
    return <div>Loading currencies...</div>; // Show a loading message while data is being fetched
  }

  return (
    <div className="currselector">
      <label htmlFor={id}>{label}</label>
      {isReadOnly ? (
        <input type="number" id={id} value={value} readOnly />
      ) : (
        <select id={id} value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name} ({option.code})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export const AmountSelector = ({ label, id, value, onChange, isReadOnly = false }) => {
  return (
    <div className="amount">
      <label htmlFor={id}>{label}</label>
      {isReadOnly ? (
        <input type="number" id={id} value={value} readOnly />
      ) : (
        <input type="number" id={id} value={value} onChange={onChange} />
      )}
    </div>
  );
};