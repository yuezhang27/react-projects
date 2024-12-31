const URL_ADDRESS = "./data.json";
const WORD_LIMIT = 50;
async function getData(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Response status:${resp.status}`);
    }
    const json = await resp.json();
    return json;
  } catch (error) {
    console.log(error.message);
  }
}

function shortText(info, limit) {
  const words = info.split(" ");
  if (words.length <= limit) {
    return info;
  } else {
    return words.slice(0, limit).join(" ") + "...";
  }
}

function showAll() {
  const abbr = document.querySelectorAll(".abbr");
  abbr.forEach((span) => {
    span.addEventListener("click", function () {
      const content = this.closest(".content");
      content.classList.toggle("expand");
      if (content.classList.contains("expand")) {
        span.textContent = "Show Less";
      } else {
        span.textContent = "Read More";
      }
    });
  });
}

function dislike() {
  const btns = document.querySelectorAll(".int");
  btns.forEach((btn) =>
    btn.addEventListener("click", function () {
      const card = this.closest(".card");
      card.classList.add("dislike");
    })
  );
}

async function start() {
  const data = await getData(URL_ADDRESS);
  const tours = document.getElementsByClassName("tours")[0];
  let content = "";
  data.forEach((tour, i) => {
    if (i % 2 == 0) {
      content += '<div class="row">';
    }
    content += `<div class="card col-12 col-md-6" id="${tour.id}">
      <div class = "cardprice">
      <img class="card-img-top" src="${tour.image}" alt="${tour.name}" />
      <span class="price">${tour.price}</span>
      </div>
      <div class="card-body">
        <div class="card-title name">${tour.name}</div>
        <div class="content">
        <div class="card-text short">${shortText(tour.info, WORD_LIMIT)}</div>
        <div class="card-text full">${tour.info}</div>
        <span class="abbr">Read More</span>
        </div>
        <button class="btn btn-primary int">Not interested</button>
      </div>
    </div>`;
    if (i % 2 == 1 || i == data.length - 1) {
      content += "</div>";
    }
  });
  tours.innerHTML = content;
  showAll();
  dislike();
}

start();
