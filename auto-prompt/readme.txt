自动提示：异步获取数据，js 动态构造页面结构及内容。根据输入内容，js 完成检索，并构造内容显示。

其中，列表容器的显示、隐藏在使用toggle函数时总是会出现各种问题，最终没有解决，就自己写了。
思路是：所点对象的坐标（X、Y）与所点位置在页面中的坐标（X、Y）作比较，不一致则隐藏。

现使用模拟数据，将功能独立摘取出来。使用时，结合页面结构，适时修改样式，统一数据即可。

访问地址：http://htmlpreview.github.io/?https://github.com/tuzki-1987/tuzki-repository/blob/master/auto-prompt/my-page.html