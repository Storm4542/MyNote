### CSS

**记住：能不用 height width 就不用他们，使用 padding ,  line-height 来替代**

#### 1.中文对齐

- 当我要写一个表单，有**姓名**和**联系方式**，需要姓和联对齐，名和式对齐。如何去做？

```html
<span>姓名</span>
<br>
<span>联系方式</span>
```

```css
span{
    display:inline-block;
    width:5em;
    text-align:justify;
    font-size:20px;
    line-height:20px;
    height:20px;
    overflow:hidden
}
span::after{
    content:'';
    display:inline-block;
    width:100%;
}
```

- 当我有很多文字，靠到最右边要换行了，发现文字和最右边有间距怎么办?

  `text-align:justify`

#### 2.空格问题

HTML会把两个 inline 元素之间看不见的字符都替换为一个空格，包括空格、TAB、回车。

所以有时候就会莫名其妙中间多一个空格，因为代码里有回车。

**解决方法：不用 inline 元素。**

#### 3.清除浮动

在浮动元素的爸爸身上加一个 class 

```css
clearfix::after{
    content:'';
    display:block;
    clear:both;
}
```

#### 4.文字中断

有时候文字太长了超出屏幕了，两种解决方式。

```html
<span>helooooooooooooooooooooooooooooooooooooooooooooooooo</span>
```

上面这种情况下浏览器会认为这是一个单词，一个单词是不会自动换行的。

可以加分隔符

```html
<span>helooooooo-ooooooooo-ooooooooo-oooooooo-ooooooo-ooooo-oooo</span>
```

可以使用 word-break

```css
span { word-break:break-all }
```

#### 5.文字溢出省略

当文字的长度超出了 div 的宽度，多余的部分，我们想用省略号代替。

- 一行的时候

```css
div{
    white-space:nowrap; 
    overflow:hidden;
    text-overflow:ellipsis;
}
```

- 多行

```css
div{
      display: -webkit-box;
      -webkit-line-clamp: 3;   /*3行写3，n行写n */
      -webkit-box-orient: vertical;  
}
```

#### 6.文字垂直居中

Div 的高度是跟随你文字的行数变化的，所以永远不要使用 height 给 Div 高度

那假如我想要 div 的高度是40px , 怎么办？ 使用 line-height 和 padding 

```css
div{
    line-height:24px;
    padding:8px 0;
    text-align:center;
}
```

24 + 8+ 8 = 40

#### 7.margin 合并

当子元素有 margin 的时候， 父元素如果没有“挡住”它的属性，那么就会出现父子margin 合并。

解决方案 border/ padding/ overflow(不推荐)

```css
.dad{
    border:0.1px solid white;
    padding:0.1px;
    overflow:hidden
}
```

#### 8.div 的高度怎么确定的？

div 的高度是由**文档流**中所有素高度的总和**决定**的。

文档流：内联元素从左到右，块级元素从上到下，块级元素总是另起一行。

所以脱离文档流的翻译就是：算高度别算我。（position:absolute,fixed ;  float; ）

#### 9.内联元素的宽度和高度

宽度是受 文字的多少 和 margin padding boder 影响。

高度只受行高决定。

#### 10.DIV水平垂直居中

高度不定，宽度不定的div水平垂直居中 flex 

```css
.dad{
    display:flex;
    justify-content:center;
    align-items:center
}
.son{
    ...
}
```

#### 11.写一个 1:1 的 div

使用padding撑起高度。

```css
.one{
    padding-top:100%;
}
```

