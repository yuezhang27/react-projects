1. 结构：3部分，loading是前面大约3秒左右的一个界面；tour是每个小盒子单独的element，tours是把多个tour组合拼在一起

2.loading部分

需求：index.js会让这个这个react app首先进入的是loading.html页面，是一个常用的表示缓冲的圆环，同时向一共地址fetch数据，fetch到数据之后，渲染index.html，完成后，跳转到index.html页面

处理，在loading,js里用useState,每秒给圆环换一个属性，每个属性代表1个位置

与此同时，向地址fetch数据，完成fetch之后，跳转到index,html??