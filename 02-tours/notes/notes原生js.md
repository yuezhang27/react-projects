## 1. 原生 JS,实现 Read More 效果

- 效果描述： 点击“Read more”就展示完整的段落内容，不点击就只显示一部分，比方说 50 个词
- 解决方案：CSS+JS，
  - 在 HTML 中，直接 2 个 box。一个 box 是缩略内容（比如 class 是 short），一个 box 是完整内容（class 是 full）
  - CSS 中，默认状态是：short 的 display 是 block；full 的 display 是 none
  - 在 JS 中，给“Read More”这个元素添加点击事件，每当点击这个元素，就给这个元素【切换】class
    - 【切换】class，用`元素.classList.toggle('expanded');`具体来说，就是原来如果 class 里有 expanded，那就去掉，如果没有，那就加上
  - CSS 中，设置.short.expanded 和.full.expanded；即是它们有 expanded 这个 class 时的表现，前者变成 display:none；后者变成 display:block
    - 注意，原来哦 class = "short"如果加上 expanded，那就变成“short expanded”在选择器里写作`.short.expanded`。而不是`.short .expanded`-》这个指的是，`.short` 的 class 为`.expanded` 的**后代节点**（选择器：https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_selectors）

## 2. 每一个卡片里都有 read more，怎么选每个 read more 所在的那个卡片里的元素，而不选串

- 解决方案：用 this.closest("xx")

```js
const info = this.closest(".info");
// 找到最近的info 容器
```

这个的 this 是 button，所以是对于每一个 button，找到离这个 button 最近的 class 为.info 容器

- this：当前点击的 button。
- closest('.info')：从当前元素开始，逐级向父元素查找，找到第一个匹配 .info 的父元素。
- 因为是找到离这个 read more button 最近的父元素.info，所以不会出现选串的情况

## 3. 1&2 的示例

要实现“点击 `Read More` 展示完整内容”的功能，可以通过 JavaScript 和 CSS 实现以下逻辑：

### **HTML 结构**

```html
<div class="info">
  <p class="content short">
    Paris is synonymous with the finest things that culture can offer — in art,
    fashion, food, literature, and ideas. On this tour, your Paris-savvy Rick
    Steves guide will immerse you in the very best of ...
  </p>
  <p class="content full">
    Paris is synonymous with the finest things that culture can offer — in art,
    fashion, food, literature, and ideas. On this tour, your Paris-savvy Rick
    Steves guide will immerse you in the very best of the city, taking you
    through its iconic landmarks, unique neighborhoods, and rich history.
  </p>
  <span class="read-more">Read More</span>
</div>
```

### **CSS**

```css
.info .content.full {
  display: none; /* 隐藏完整段落 */
}

.info.expanded .content.full {
  display: block; /* 显示完整段落 */
}

.info .content.short {
  display: block; /* 默认显示短段落 */
}

.info.expanded .content.short {
  display: none; /* 隐藏短段落 */
}
```

### **JavaScript**

```javascript
document.querySelectorAll(".read-more").forEach((button) => {
  button.addEventListener("click", function () {
    const info = this.closest(".info"); // 找到最近的 info 容器
    info.classList.toggle("expanded"); // 切换展开状态

    // 更新按钮文字
    if (info.classList.contains("expanded")) {
      this.textContent = "Show Less";
    } else {
      this.textContent = "Read More";
    }
  });
});
```

---

### **工作原理**

1. 默认显示短段落 `.content.short`，隐藏 `.content.full`。
2. 点击 `Read More` 后：

   - 切换 `info` 容器的 `expanded` 类名。
   - 隐藏短段落，显示完整段落。
   - 更新按钮文字为 `Show Less`，再次点击切换回原状态。

## 4. 为什么我们更经常用`querySelectorAll('.classname');`选取元素，而不是用`getElementByClassName`；

- **尤其是当我们想用 forEach 给每一个元素都处理时，一定是用`querySelectorAll('.classname');`**
- 因为 getElementsByClassName 返回的是一个 HTMLCollection，而不是一个真正的数组。HTMLCollection 不支持 .forEach 方法；而`querySelectorAll`返回的是 NodeList，可以用.forEach

## 5.还是 Read More 的案例，如果 info 是这样获取到的<div class="card-text info">${tour.info}</div> 如何在此基础上，让省略的时候只显示前 50 个 word？

### 【解决方案】

- 首先在 start 函数之前，写一个用于把传入文本缩减到前 x 个单词的函数，truncateWords。接收 2 个变量，分别是需要被缩减的文本，和需要的单词个数
- 然后在开始 forEach 渲染数据之后，首先在 forEach 里，对每一段的 info 进行处理
  const truncatedInfo = truncateWords(tour.info, 50); // 截取前 50 个单词
- 后面在动态渲染的 html 模板里，直接使用{truncatedInfo}就可以获取处理后的文本
<div class="card-text info short">${truncatedInfo}</div>

以下是完整的实现方案：

### **改进后的 HTML 结构**

```html
<div class="card">
  <div class="card-text info">
    <!-- 这里动态渲染文字 -->
  </div>
  <span class="read-more">Read More</span>
</div>
```

---

### **改进后的 JavaScript**

```javascript
function truncateWords(text, wordLimit) {
  const words = text.split(" "); // 按空格拆分为单词
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "..."; // 截取前 wordLimit 个单词，并加上省略号
  }
  return text; // 如果文字少于 wordLimit 个单词，直接返回
}

async function start() {
  const data = await getData(URL_ADDRESS); // 获取数据
  const tours = document.getElementsByClassName("tours")[0];
  let content = "";

  data.forEach((tour) => {
    const truncatedInfo = truncateWords(tour.info, 50); // 截取前 50 个单词
    content += `
      <div class="card">
        <div class="card-text info short">${truncatedInfo}</div>
        <div class="card-text info full" style="display:none;">${tour.info}</div>
        <span class="read-more">Read More</span>
      </div>
    `;
  });

  tours.innerHTML = content;

  // 绑定点击事件
  document.querySelectorAll(".read-more").forEach((button) => {
    button.addEventListener("click", function () {
      const info = this.closest(".info"); // 找到最近的 info 容器
      info.classList.toggle("expanded"); // 切换展开状态

      // 更新按钮文字
      if (info.classList.contains("expanded")) {
        this.textContent = "Show Less";
      } else {
        this.textContent = "Read More";
      }
    });
  });
}

start();
```

---

### **实现效果**

1. 使用 `truncateWords` 函数对 `tour.info` 截取前 50 个单词，并在短文本中显示。
2. 短文本和完整文本分别用 `.info.short` 和 `.info.full` 渲染。
3. 点击 `Read More` 切换显示完整文本，并动态修改按钮文字为 `Show Less`。

---

## 6. js 文件中各个函数之间的关系

- start 函数是唯一需要单独调用的。相当于总的开始
- 其他函数的调用都写在 start 里面
