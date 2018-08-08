### 堆叠上下文

#### 1.堆叠顺序

div是有空间层次关系的。

原则：相同类型的元素，后出现的会覆盖之前的。

层次顺序（底层-上层）： 

1. background
2. border
3. 块级
4. 浮动
5. 内联
6. z-index : 0 ( position :relative , absolute)
7. z-index :  +

注意：z-index 只有在 position 不是 static 的时候才有用，比如 relative , absolute

#### 2.怎么样形成堆叠上下文

可以理解为堆叠作用域。跟 BFC 一样，我们只知道一些属性会触发堆叠上下文，但并不知道堆叠上下文是什么。

- **根元素 (HTML),**
- **z-index 值不为 "auto"的 绝对/相对定位，**
- **一个 z-index 值不为 "auto"的 flex 项目 (flex item)，即：父元素 display: flex|inline-flex，**
- **opacity 属性值小于 1 的元素（参考 the specification for opacity），**
- **transform 属性值不为 "none"的元素，**
- mix-blend-mode 属性值不为 "normal"的元素，
- filter值不为“none”的元素，
- perspective值不为“none”的元素，
- isolation 属性被设置为 "isolate"的元素，
- **position: fixed**
- 在 will-change 中指定了任意 CSS 属性，即便你没有直接指定这些属性的值（参考 这篇文章）
- -webkit-overflow-scrolling 属性被设置 "touch"的元素