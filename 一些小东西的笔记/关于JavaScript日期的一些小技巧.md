最近在做小程序，要做一些关于日期方面的计算，于是整理下来，方便下次使用

#### 1. 获得年月日

```javascript
function newDateInit() {
  let newDate = new Date();
  let month = newDate.getMonth();
  if (month < 10) {
    month = "0" + month; //补齐
  }
  day = newDate.getDate();
  if (newDate.getDate() < 10) {
    day = "0" + day; //补齐
  }
  year = newDate.getFullYear();
}
```

#### 2.计算前一天，后一天

一开始我考虑假如我现在是 1 号，前一天不就是 0 了吗？其实不用考虑这么多，JS 帮我们做好了判断。

```javascript
var currentDate = new Date();
var currentDay = currentDate.getDate();
var currentMonth = currentDate.getMonth();
var currentYear = currentDate.getFullYear();
//现在要计算明天的日期
var nextDate = new Date(currentYear,currentMonth,currentDay+1);
//前一天的日期
var preDate = new Date(currentYear,currentMonth,currentDay-1);
//下个月，上个月同理
```

无需考虑边界问题。

#### 3.假如给的是 2018-01-03 这种数值，传回去也要这种类型怎么办？

先用 split 分隔为数组，再转换为 Number ，再进行加减，再转换为 String ,再拼接

```javascript
data() {
  return {
    currentYear: 2018,
    currentMonth: 9,
    currentDay: 1,
    currentDate: "2018-09-01",
  }
},
methods: {
  currentDateSplit() {  //用 '-'分隔传入数组
    let num = [];
    let str = [];
    let current = this.currentDate.split("-");
    current.forEach((item) => {
      num.push(parseInt(item));
    });
    return num;
  },
  newDateInit(newDate) { // 初始化 新生成的日期
    this.currentMonth = newDate.getMonth();
    if (this.currentMonth < 10) {
      this.currentMonth = "0" + this.currentMonth; //补齐
    }
    this.currentDay = newDate.getDate();
    if (newDate.getDate() < 10) {
      this.currentDay = "0" + newDate.getDate(); //补齐
    }
    this.currentYear = newDate.getFullYear();
  },
  preDay() {  //前一天
    let num = this.currentDateSplit();
    let newDate = new Date(num[0], num[1], num[2] - 1);
    this.newDateInit(newDate);
    this.DateJoin();
  },
  nextDay() { // 后一天
    let num = this.currentDateSplit();
    let newDate = new Date(num[0], num[1], num[2] + 1);
    this.newDateInit(newDate);
    this.DateJoin();
    this.DateJoin();
  },
  DateJoin() { //拼接为 'xxxx-xx-xx' 返回去
    this.currentDate = 
        this.currentYear + "-" + this.currentMonth + "-" + this.currentDay;
  }
}
```

