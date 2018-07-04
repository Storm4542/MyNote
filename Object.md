## Object

### 1.Object.assign()

如果目标对象中的属性具有相同的键，则属性将被源中的属性覆盖。后来的源的属性将类似地覆盖早先的属性。

```javascript
//复制一个对象
var obj = {a:1}
var copy = Object.assign({},obj)//copy:{a:1}
//合并n个对象
var obj2 = {a:2,b:3}
var newobj = Object.assign(obj1,obj2) //newobj:{a:2,b:3} 属性被后续参数中具有相同属性的其他对象覆盖。

```

