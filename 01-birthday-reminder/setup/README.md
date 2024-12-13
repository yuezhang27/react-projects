## Idea

[https://uidesigndaily.com/](https://uidesigndaily.com/posts/sketch-birthdays-list-card-widget-day-1042)


# React 开发笔记

## `.map()` 方法的使用

### 基本语法
```jsx
{data.map((item, index) => (
  <div key={index}>
    {/* 渲染每个数据项 */}
  </div>
))}
```

### 关键点
1. 必须在 `{}` 中使用 `.map()`
2. `.map()` 用于动态生成元素列表
3. 每个生成的元素需要一个唯一的 `key` 属性
4. 直接在 `return` 语句中使用 `{data.map(...)}` 来动态生成元素。
5. 使用 `<>...</>` （React fragments）或者 `<div>...</div>` 来包裹多个元素。

### 示例
这段代码会遍历 `data` 数组，为每个数据项创建三个 `<div>` 元素，分别显示名字、年龄和图片。

```jsx
const data = [
  { name: "张三", age: 25, image: "path/to/image1.jpg" },
  { name: "李四", age: 30, image: "path/to/image2.jpg" }
];

const List = () => (
  <div>
    {data.map((person) => (
      <div key={person.id}>
        <img src={person.image} alt={person.name} />
        <div>{person.name}</div>
        <div>{person.age}</div>
      </div>
    ))}
  </div>
);
```

## 条件渲染
### 条件状态控制
```jsx
const [showContent, setShowContent] = useState(true);
const [count, setCount] = useState(5);

const handleClear = () => {
  setCount(0);
  setShowContent(false);
};
```

### 使用`&&`进行条件渲染
1. `&&` 运算符可快速实现条件渲染
2. 左侧为 `false` 时不渲染右侧内容
3. 【用例】**适用于简单的显示/隐藏逻辑**
#### 条件渲染简单讲解
1. 在 React 中,当我们使用 `{}` 包裹表达式时,React 会将表达式的结果渲染到 DOM 中。
2. `{showContent && (...)}` 的工作原理如下:
    1. 如果 `showContent` 为 `false`,整个表达式的结果就是 `false`,React 就不会渲染任何内容。
    2. 如果 `showContent` 为 `true`,整个表达式的结果就是 `(...)`,也就是我们想要渲染的生日列表部分。
```jsx
{showContent && (
  // 仅当 showContent 为 true 时渲染
  <div>...</div>
)}
```


### 整体使用代码
```jsx
import React, { useState } from 'react';

const List = () => {
  const [count, setCount] = useState(5);
  const [showContent, setShowContent] = useState(true);

  const handleClick = () => {
    setCount(0);
    setShowContent(false);
  };

  return (
    <div className="white">
      <div className="title">{count} Birthdays Today</div>
      {showContent && (
        <>
          {data.map((person) => (
            <div key={person.id} className="personalInfo">
              <div className="left">
                <img src={person.image} className="photo" />
              </div>
              <div className="right">
                <div className="name">{person.name}</div>
                <div>{person.age} years</div>
              </div>
            </div>
          ))}
        </>
      )}
      <button className="button" onClick={handleClick}>
        Clear All
      </button>
    </div>
  );
};

export default List;
```

解释一下:

1. 添加了一个新的状态 `showContent`。默认情况下,它被设置为 `true`。
2. 在 `render` 中,使用 `{showContent && (...)}` 来有条件地渲染生日列表。如果 `showContent` 为 `false`,列表将不会显示。

# CSS

## CSS 布局问题与解决方案整理

### 1. 布局原则与Best Practice

**问题场景**：在构建响应式、可维护的界面时，传统使用 `float` 的布局方式容易导致代码复杂度高、父元素高度坍塌、以及响应性差的情况。

**解决方案**：  
- **优先使用现代布局方案**：
  1. **Flexbox**：用于单行或单列方向上的灵活布局
  2. **Grid**：用于更复杂、二维的栅格布局
- **避免使用 `float`**：`float` 的布局特性繁琐且不易维护
- 通过使用现代布局方式，提升代码的可读性、可维护性和响应式表现。

-------------------------------------

### 2. 父容器高度坍塌问题（传统布局中的典型问题）

**问题场景**：在使用 `float` 来并列子元素时，父容器由于未包含浮动的子元素，会出现高度“坍塌”现象，造成视觉和布局上的混乱。

**解决方案**（传统方法与现代方法对比）：  
1. **清除浮动（clearfix）**：  
   ```css
   .container::after {
     content: "";
     display: table;
     clear: both;
   }
   ```
   通过在父容器使用 `::after` 伪元素清除浮动，使父容器能够包裹其浮动的子元素从而恢复正常的高度。

2. **使用 `overflow: auto` 或 `hidden`**：  
   ```css
   .container {
     overflow: auto; /* 或 overflow: hidden */
   }
   ```
   给父容器加上 `overflow` 设定，也可以强制父容器包含浮动子元素。

3. **使用 Flexbox / Grid 替代浮动布局**（推荐）：
   ```css
   .container {
     display: flex; /* 或 display: grid */
     /* 其他布局规则 */
   }
   ```
   使用现代布局方案从根本上避免父元素坍塌问题。

-------------------------------------

### 3. 让两个盒子并列排布的问题（左右布局）

**问题场景**：需要在一个父容器中让两个子盒子并排显示，并且具有特定的宽度比例（如左侧 30%、右侧 70%）。

**传统解决方案（不推荐，但供参考）**：
- 使用 `float: left;` 为两个盒子浮动，然后在父容器上使用清除浮动。
- 代码示例（不推荐）：
  ```css
  .personalInfo { float: left; width: 100%; }
  .left { float: left; width: 30%; }
  .right { float: left; width: 70%; }
  .personalInfo::after {
    content: "";
    display: table;
    clear: both;
  }
  ```

**现代推荐方案**：使用 Flexbox 或 Grid 简化布局

1. **Flexbox**：  
   ```css
   .personalInfo {
     display: flex;
   }
   .left {
     width: 30%;
   }
   .right {
     width: 70%;
   }
   ```
   
2. **Grid**：  
   ```css
   .personalInfo {
     display: grid;
     grid-template-columns: 30% 70%;
   }
   ```

这样不仅代码更简洁，也更便于后续维护和响应式适配。

-------------------------------------

### 4. 元素（按钮）水平居中问题

**问题场景**：需要在容器内部，让一个按钮水平居中显示。

**解决方案一（Flex + Utility Class，如 Tailwind）：**  
在需要居中的元素外层加一层容器，并设为 `display: flex; justify-content: center;`  
例如在 React 的 JSX 中（使用 Tailwind CSS）：  
```jsx
<div className="flex justify-center mt-6">
  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    居中按钮
  </button>
</div>
```

如果不使用 Tailwind，纯 CSS 也可以轻松实现：  
```css
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem; /* 相当于 mt-6 */
}
```

-------------------------------------

### 5. Flexbox 的常用属性释义

**问题场景**：在使用 Flexbox 布局时，对其常用属性的作用可能不够清晰。

**常用属性说明**：  
- `display: flex;`：将容器变为 Flex 容器，内部元素成为 Flex 项目  
- `flex-direction: row | column`：决定主轴方向（水平或垂直）  
- `justify-content: center | flex-start | flex-end | space-between ...`：定义项目在主轴方向上的排列、对齐方式  
- `align-items: center | flex-start | flex-end ...`：定义项目在交叉轴方向上的对齐方式  
- `flex: grow shrink basis`：  
  - `flex-grow`: 空间富余时项目的放大比例  
  - `flex-shrink`: 空间不足时项目的缩小比例  
  - `flex-basis`: 项目的初始大小（可使用固定值或百分比）

通过灵活使用这些属性，可以实现灵活的、可适配多种屏幕和内容变化的布局。

-------------------------------------

**总结**：  
- 现代布局优先考虑使用 Flexbox 和 Grid，而非传统的 `float`。
- 面对父元素坍塌、子元素并列布局、元素居中等常见问题，都有对应的现代化解决方案（Flex 或 Grid）。
- 注重语义性、响应式和可维护性，是编写 CSS 时的重要原则。
