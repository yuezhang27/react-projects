## 1. 点击>就切换数据

### 整体思路

1. 给>添加点击事件
2. 数据在一个数组里，点击>会给 counter+1（counter=（counter+1）%数组长）
3. 然后每次数据 person 是 数组[counter]
4. 然后把 {person.image}等渲染到模板里
5. 如果用原生 JS，应该是现在 html 里把所有非渲染的固定模板写好，然后在 js 里依次 getElement，然后把数据更新进去

## 2. 点击 Surprise me

1. 给 Surprise me 添加点击事件
2. 数据在一个数组里，点击 suprise me 会把 counter 设置为 0-数组长-1 之间的随机数
3. 然后每次数据 person 是 数组[counter]

## 3. 重点：正确的事件绑定

#### 错误写法

```javascript
ele.addEventListener("click", getPerson(this, people));
```

- 这里 getPerson(this, people) 会立即执行，而不是将函数作为回调传递。
- this 在这里也指向全局作用域或模块，而不是 ele。

#### 正确写法:

将 getPerson 包装成箭头函数，延迟执行，并传递 ele。

```javascript
ele.addEventListener("click", () => getPerson(ele, people));
```
