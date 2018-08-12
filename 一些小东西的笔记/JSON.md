### JSON数据处理

#### 1.JSON是什么

JSON：javascript Object Notation

MDN上说明，JSON是一种语法，用来序列化对象、数组、数值、字符串、布尔值和null,它基于 javascript 语法，但**JavaScript不是JSON，JSON也不是JavaScript**。

- JSON.parse(string) ：接受一个 JSON 字符串并将其转换成一个 JavaScript 对象。
- JSON.stringify(obj) ：接受一个 JavaScript 对象并将其转换为一个 JSON 字符串。

#### 2.JSON.stringify(value[, replacer , [, space]])

**`JSON.stringify()` **方法是将一个**JavaScript值(对象或者数组)**转换为一个 **JSON字符串**，如果指定了replacer是一个函数，则可以替换值，或者如果指定了replacer是一个数组，可选的仅包括指定的属性。

```javascript
var a = { 'name': '风暴之灵', 'age':500 , 'isLive':true }
JSON.stringify(a) // "{'name': '风暴之灵', 'age':500 , 'isLive':true }"
JSON.stringify(a,(key,value)=>{
    if(typeof value === "string"){ return undefined } // 返回 undefined 表示删除
    return value
}) // "{"age":500,"isLive":true}"
JSON.stringify(a , ['name']) // "{"name":"风暴之灵"}" 数组内的参数代表 JSON 字符串的属性名
JSON.stringify(a, null , "---")//"{---"name": "风暴之灵",---"age": 500,---"isLive": true}"
```

#### 3.JSON.parse(text[, reviver])

**`JSON.parse()`** 方法用来解析**JSON字符串**，构造由字符串描述的JavaScript值或对象。提供可选的reviver函数用以在返回之前对所得到的对象执行变换(操作)。

```javascript
var a = { name: 'strom'}
var b = JSON.stringify(a);
var c = JSON.parse(b)
var c = JSON.parse(b,(key,value)=>{
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value;
}) // {name: "STORM"}
```

