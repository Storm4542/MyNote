function (fn){
    let defaultfn = (a,b)=>{ return a-b }
    fn = fn|| defaultfn
    var roundcount = this.length; //比较的轮数
    for(let i = 0 ; i < roundcount ; i++){
          let minIndex = this[i]
          for( let k = 0 ; k < this.length ; k++){
            if(fn.call( null , this[i] , this[k]) < 0 ){
              [ this[i] , this[k] ] = [ this[k] , this[i] ] //es6新语法，交换值
            }
          }
    }
  }