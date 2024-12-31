import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import Tours from "./Tours";
// ATTENTION!!!!!!!!!!
// I SWITCHED TO PERMANENT DOMAIN
// const url = "https://course-api.com/react-tours-project";
const url = "./data.json";

function App() {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const fetchUrl = async () => {
    setLoading(true);
    try {
      const resp = await fetch(url);
      // if (!resp.ok) {
      //   throw new Error(`Response status:${resp.status}`);
      // }
      const json = await resp.json();
      setLoading(false);
      setTours(json);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const removeTour = (id) => {
    setTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
  };
  useEffect(() => {
    fetchUrl();
  }, []);
  if (loading) {
    return (
      <main>
        <Loading />
      </main>
    );
  }
  return (
    <main>
      <h2>Our Tours</h2>
      <Tours tours={tours} removeTour={removeTour} />
    </main>
  );
}

export default App;
