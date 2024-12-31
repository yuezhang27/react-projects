import React, { useState } from "react";

const WORD_LIMIT = 50;
function shortText(info, limit) {
  const words = info.split(" ");
  if (words.length <= limit) {
    return info;
  } else {
    return words.slice(0, limit).join(" ") + "...";
  }
}

const Tour = ({ id, name, info, image, price, removeTour }) => {
  const [expand, setExpand] = useState(false);
  const displayContent = expand ? info : shortText(info, WORD_LIMIT);
  const readMore = expand ? "Show Less" : "Read More";
  return (
    <div class="card col-12 col-md-6" id={id}>
      <div class="cardprice">
        <img class="card-img-top" src={image} alt={name} />
        <span class="price">{price}</span>
      </div>
      <div class="card-body">
        <div class="card-title name">{name}</div>
        <div class="content">
          {/* 尚未处理 */}
          {/* <div class="card-text short">${shortText(tour.info, WORD_LIMIT)}</div> */}
          <div class="card-text">{displayContent}</div>
          <span
            class="abbr"
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {readMore}
          </span>
        </div>
        {/* 这里为啥onclick里不是 onlClick={removeTour(id)},是默认语法就是onlClick={()=>效果函数} 吗？ */}
        <button class="btn btn-primary int" onClick={() => removeTour(id)}>
          Not interested
        </button>
      </div>
    </div>
  );
};

export default Tour;
