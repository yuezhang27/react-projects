import React from "react";
import data from "./data";
import { useState } from 'react';



const List = () => {
  const [count,setCount] = useState(5);
  const [flag,setFlag] = useState(true);
  function handleClick(){
    setCount(count-count);
    setFlag(false);
  }
  return (
    <div className="white">
      <div className="title">{count} Birthdays Today</div>
      {flag && (
        <>
      {data.map((person) => (
        <div key={person.id} className="personalInfo">
          <div className="left">
            <img src={person.image} className="photo"/>
          </div>
          <div className="right">
            <div className="name">{person.name}</div>
            <div>{person.age} years</div>
          </div>
        </div>
      ))}</> )}
      <button className="button" onClick={handleClick}>Clear All</button>
    </div>
  );
};


export default List;
