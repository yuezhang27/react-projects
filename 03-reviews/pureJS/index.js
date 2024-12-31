const URL = "./data.json";
var counter = 0;

async function getData(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    const json = await resp.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

function showPerson(person) {
  const image = document.getElementById("headshot");
  const name = document.getElementById("name");
  const title = document.getElementById("title");
  const about = document.getElementById("about");
  image.src = person.image;
  image.alt = `${person.name} headshot`;
  name.textContent = person.name;
  title.textContent = person.job;
  about.textContent = person.text;
}

function getPerson(ele, people) {
  if (ele.id === "forward") {
    counter = (counter + 1) % people.length;
  } else if (ele.id === "backward") {
    counter = (counter - 1) % people.length;
  } else {
    counter = Math.floor(Math.random() * people.length);
  }
  const person = people[counter];
  showPerson(person);
}

function clicks(people) {
  const e = document.querySelectorAll(".clicks");
  e.forEach((ele) => {
    ele.addEventListener("click", () => getPerson(ele, people));
  });
}

async function start() {
  const people = await getData(URL);
  if (!people || !Array.isArray(people)) {
    console.error("Failed to load data or data is not valid.");
    return;
  }
  clicks(people);
  showPerson(people[counter]);
}

start();
