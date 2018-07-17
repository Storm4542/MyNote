/*因为没有后台，默认bookdata就是从服务器传来的数据，由fethDb获取，saveDb更新 */
var bookData = {
    "id": "1",
    "name": "javascript高程",
    "number": 2 //数量
}
function fetchDb() {
    return bookData;
}
function saveDb() {
    return bookData;
}

/*我们需要把内容放到HTML里，所以需要有个模板 */

var template = `
        书名<span id="name">《__name__》</span>
        数量<span id="number"> __number__</span>
        <div>
        <button id="add">加一</button>
        <button id="minus">减一</button>
        </div>
        `
/*将我们的数据，放入模板*/
function showBook(result){
    var html = template.replace('__name__', result.name).replace('__number__', result.number);
    $('#app').html(html)
}
showBook(fetchDb())
/*写加减数量的方法 */     
function add() { 
    bookData.number+=1 
    var newdata =  saveDb(); //假设更新了，并从服务器获取了修改后的新数据
    $('#number').text( newdata.number)
    
}
$('#add').on('click',add)
function minus() { 
    bookData.number-=1
    var newdata =  saveDb();
    $('#number').text( newdata.number)
    
}
$('#minus').on('click',minus)
