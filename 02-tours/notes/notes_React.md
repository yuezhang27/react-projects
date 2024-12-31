## 1. 本项目所有文件的目的

- 最终要达到的效果，是从一个地址 fetch 数据，得到数据后，使用数据+bootstrap 里的卡片，动态渲染，每个数据里的对象对应一个卡片。

- 一共给了这些初始文件：

1. index.js 是整个网页的最基础，它会要求调用 react
2. App.js 最终用 react 完成的 web app 本身，里面包括 Tours 这个组件，和一些非常简单的页首的内容
3. Tours.js 包括许多个 Tour 组件，是为了把 Tour 组件组合起来
4. Tour.js 对应一张卡片，关于卡片上的内容，结构，和点击等效果都是在这里设置

## 2. 一般来说，引入数据 （fetch）这一步，是哪里进行？在 App.js 进行 fetch，然后在 Tour.js 里引入？

### 整体大致思路：在父级组件（如 App.js）中进行 fetch，并将数据通过 props 传给子组件

1. 在**App.js**中**使用`useEffect`获取数据并存放在 state 中**； -》》 **固定操作**
2. 将获取到的数据以 props 形式传给**Tours.js**；
3. **Tours.js**再循环渲染多个**Tour.js**；
4. **Tour.js**专注于渲染单个卡片的 UI 和交互逻辑。

### 示例

---

### App.js

```jsx
import React, { useState, useEffect } from "react";
import Tours from "./Tours";

function App() {
  // 在App里，首先用一个空数组[]初始化useState，用来存放未来会获取到的数据
  const [tours, setTours] = useState([]);
  //   使用useEffect获取数据：在useEffect里使用fetch来获取数据，并且通过使用fetch.then.then这样的结构，把获取到的数据，使用setTours(useState里那个函数),存入到tour这个变量里
  useEffect(() => {
    // 假设后端提供的接口地址是 /api/tours
    fetch("/api/tours")
      .then((res) => res.json())
      .then((data) => setTours(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h1>My Tours</h1>
      // 使用props把tours传给Tours组件
      <Tours tours={tours} />
    </div>
  );
}

export default App;
```

### Tours.js

```jsx
import React from "react";
import Tour from "./Tour";

function Tours({ tours }) {
  return (
    <div className="row">
      {tours.map((item) => (
        // 还是使用props把每个item的值传给Tour组件，特别地，考虑到Tour想要分别接收每一个item的属性，即接收id，info，image...我们使用{...item}这个格式去传递item
        <Tour key={item.id} {...item} />
      ))}
    </div>
  );
}

export default Tours;
```

### Tour.js

```jsx
import React from "react";
// 前面Tours那里用{...item}传递数据，这里就可以每个属性分别接收
function Tour({ id, title, description, image }) {
  return (
    <div className="col-4">
      <div className="card">
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <button className="btn btn-primary">Read More</button>
        </div>
      </div>
    </div>
  );
}

export default Tour;
```

**逻辑说明**

1. **App.js**：用`useEffect`从后端 API 获取数据，并存储到`tours`的 state 中。然后用<Tours tour = {tour}/>这样的 props 形式，把 tours 的值传给 Tours 组件
2. **Tours.js**：接收`tours`数组，循环渲染多个**Tour**组件。
3. **Tour.js**：负责单个卡片的 UI。

## 3. 关于 props 的讲解

1. **基本概念：组件的属性（Props）**

   - 在 React 中，父组件可以通过“属性”（props）传递数据或者函数给子组件。
   - 这些属性写在 JSX 语法里，形如 `<子组件 属性名={值} />`。

2. **`<Tours tours={tours} removeTour={removeTour} />` 的含义**

   - `tours={tours}`：将当前组件（可能是 `App.js`）里的 `tours`（一个数组或对象）传递给子组件 `Tours`。
   - `removeTour={removeTour}`：同理，把 `removeTour` 这个函数也一起传给了 `Tours`。
   - 这两者都属于“props”，在 `Tours` 组件内可以通过 `props.tours` 和 `props.removeTour` 来获取。

3. **`{...item}` 这种写法**

   - `{...item}` 属于 **对象展开**（Object Spread）语法。
   - 当你有一个对象（如 `tour = { id: 1, name: 'abc', info: 'xxx' }`），使用 `<Tour {...tour} />` 相当于把 `tour` 对象中的每个键值都作为单独的属性传给 `Tour` 组件，例如：
     ```jsx
     <Tour id={tour.id} name={tour.name} info={tour.info} />
     ```
   - 这是为了写起来更简洁，省去一个个指定属性名的麻烦。

4. **总结**
   - `<Tours tours={tours} removeTour={removeTour} />` 就是把 `tours` 和 `removeTour` 分别作为 props 传给子组件 `Tours`。
   - `...item` 是在传递对象时的一种简写，它将对象中的所有属性都展开成为子组件的独立 props。

---

## 4. Not Interested 的 React 做法

### 思路简述

#### Not Interested 思路

1. 在 App 里写一个函数，这个函数

- 接收卡片的 id
- 然后使用之前 tours 的那个 useState 里面的 setState，- 每次接收到 id 之后，更新状态：更新为过滤只留下 id 不是这个传入 id 的数据

#### Not Interested 大致实现

```jsx
// 在App里写一个用id来删除对应卡片的函数
const removeTour = (id) => {
  setTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
};

....
// 然后把这个函数通过props传给Tours
<Tours tours={tours} removeTour={removeTour} />

// 后面Tours.js里，再把这个函数传给Tour组件
<Tour key={tour.id} {...tour} removeTour={removeTour} />

// 最后Tour.js里，给这个Not Interested button添加点击事件
 <button className="btn btn-primary int" onClick={() => removeTour(id)}>
          Not Interested
        </button>
```

### 代码示例

#### 1. App.js

```jsx
import React, { useState, useEffect } from "react";
import Tours from "./Tours";

const url = "./data.json";

function App() {
  const [tours, setTours] = useState([]);

  // 获取数据
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setTours(data))
      .catch((error) => console.log(error));
  }, []);

  // 删除一条tour
  const removeTour = (id) => {
    setTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
  };

  return (
    <div>
      <h2>Our Tours</h2>
      <Tours tours={tours} removeTour={removeTour} />
    </div>
  );
}

export default App;
```

#### 2. Tours.js

```jsx
import React from "react";
import Tour from "./Tour";

const Tours = ({ tours, removeTour }) => {
  return (
    <div className="row">
      {tours.map((tour) => (
        <Tour
          key={tour.id}
          {...tour}
          removeTour={removeTour} // 传给子组件
        />
      ))}
    </div>
  );
};

export default Tours;
```

#### 3. Tour.js

```jsx
import React, { useState } from "react";

const WORD_LIMIT = 50;

function shortText(info) {
  const words = info.split(" ");
  if (words.length <= WORD_LIMIT) return info;
  return words.slice(0, WORD_LIMIT).join(" ") + "...";
}

const Tour = ({ id, name, info, image, price, removeTour }) => {
  const [expanded, setExpanded] = useState(false);

  const displayText = expanded ? info : shortText(info);

  return (
    <div className="card col-12 col-md-6" id={id}>
      <div className="cardprice">
        <img className="card-img-top" src={image} alt={name} />
        <span className="price">{price}</span>
      </div>
      <div className="card-body">
        <div className="card-title name">{name}</div>
        <div className="card-text">
          {displayText}
          <span
            style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Read More"}
          </span>
        </div>
        <button className="btn btn-primary int" onClick={() => removeTour(id)}>
          Not Interested
        </button>
      </div>
    </div>
  );
};

export default Tour;
```

- **逻辑核心**：
  - `expanded` 初始为 `false`。
  - 展示的文字 `displayText` 根据 `expanded` 切换长短文本。
  - 点击 “Read More/Show Less” 改变 `expanded` 状态。
  - 点击 “Not Interested” 时调用父组件的 `removeTour`，直接在父组件中通过 `filter` 将该条删除。

#### 【重点】setState 修改状态

setState((prev) => prev + 1)
prev：存储上一次的状态值
return prev + 1：返回要修改为的状态值。

**核心要点：**

1. 当新的状态**依赖**于**上一次**状态时，应该用**回调函数**的形式： `setTours((prevTours) => {...})`；
2. `prevTours` 代表**更新之前**的 `tours` 值；
3. 回调函数里返回**新的状态**，React 会将其设为当前组件的最新状态。

---

### 示例：`removeTour(id)`

```jsx
const removeTour = (id) => {
  setTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
};
```

- `prevTours` 是**之前**的 tour 列表；
- `prevTours.filter(...)` 会返回一个**剔除**指定 id 后的新数组；
- 最终 `setTours` 把这个返回的新数组更新到 `tours` 状态。

---

## 5. 如何让两张卡片为一 row

### 思路简述

- 用 `className="card col-12 col-md-6"` 即可让每个卡片在中等及以上屏幕宽度时占 6 列（2 列并排）。
- Bootstrap 会自动处理换行，不需要再手动判断 `i % 2`。
- 如果明确要 2 个卡片一行，可以统一让父容器是 `<div className="row">`，然后每个卡片是 `<div className="col-12 col-md-6">`。

示例中，**Tours.js** 中用 `<div className="row">` 包住整个渲染区域即可，**Tour.js** 里再配合 `.col-12 col-md-6`。

---

## 6.页面看不到数据

1. 确认 `data.json` 需要放在 `public` 文件夹下，则路径通常写成 `/data.json`;
2. 如果在 `src` 同级，需要用 `import data from "./data.json"` 直接获取。

## 7. Read More/Show Less 的处理

### 思路

#### Read More 整体思路

1. 在 **Tour.js** 里，用一个 `useState` 控制展开/收起状态（true/false）；
2. 当展开时，按钮文案为 “Show Less”，否则为 “Read More”；

#### 结合代码的具体大致思路

1. 首先，这种点击了就展开/折叠，这种切换动作，应该想到使用 useState。所以首先在 Tour 里，初始化一个 useState，初始化 expanded 为 false
2. 然后，用一个变量 displayText 代表我们要展示的内容，用三元表达式决定 displayText 具体的值：expanded 为 true 就展示 shortText(info),expanded 为 false 就展示 info
3. 然后直接把{displayText}放在我们要展示文字的那个 box 里，我们直接展示{displayText}就行
4. 给显示 Read More 的那个<span> 添加一个点击事件，点击之后，使用 setExpand(!expanded)来切换 expanded 的值：如果原来是 expanded 为 false，就改成 true；反之如果原来是 true，就改成 false

#### 整体操作流

- expanded 的值初始为 false，因此，根据三元表达式{displayText}初始展示的是 shortText{info}
- Read More<span>被绑定了点击事件，点击之后，触发 setExpand，现在 expanded 的值被切换为 true
- {displayText}根据三元表达式，重新被渲染为 info

```jsx
// 用useState初始化expanded
const [expanded, setExpanded] = useState(false);

// 根据expanded值，动态决定displayText，这个变量，就是后面文本具体展示哪个：info或者shortText(info)
const displayText = expanded ? info : shortText(info);

<div className="card-text">
  {displayText}
  <span
    style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
    onClick={() => setExpanded(!expanded)}
  >
    {expanded ? "Show Less" : "Read More"}
  </span>
</div>;
```

### 8. 关于 React 里的 re-render

1. 从 7 这里，可以看到 displayText 尽管前面初始化过，后面随着 expanded 的值的变化，{displayText}会被重新渲染

- 你可以想到 Python 或者 Java 那些别的程序都是从头到尾跑一遍完事，所以如果 React 也是这样的话，理论上 expanded 的值就算后面变了，也不应该再用三元表达式重新计算和渲染 displayText 的值

2. 这就让我们发现了

#### React 的核心特性：当组件状态（state）改变时，React 会自动触发一次“重新渲染”（re-render）。

1. **状态驱动渲染**

   - 在 React 中，页面上的显示（即 JSX）与组件的 state（比如 tour，expanded，就是 useState 里面的那个 state 变量）相绑定；
   - 当 state 发生变化，React 会对该组件进行一次更新（渲染），计算出更新后的页面结构。

1. **为什么重新渲染**

   - `expanded` 值从 false 切换为 true，属于组件的 state 发生了变化；
   - React 侦测到“state 已改变”，便会重新执行该组件函数，重新计算变量 `displayText`、重新执行三元运算符；
   - 最终把新的结果更新到页面上。

1. **过程简述**

   - **初次渲染**：`expanded` 初始化为 `false`，所以 `displayText = shortText(info)`；
   - **点击后**：`setExpanded(!expanded)`，切换状态；
   - **React 检测到状态变化**，再次调用组件函数，根据新的 `expanded` 值获取新的 `displayText = info`；
   - 让页面呈现出新的文本内容。

1. **与“普通程序从头到尾运行一遍”不同**
   - React 的运行模式并非一次运行完就结束，**它会在状态改变时重复执行渲染函数**；
   - 这样可以始终将 UI 与最新的 state 同步，使得界面会随着数据变化而更新。
