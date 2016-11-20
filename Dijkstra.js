/**
* Dijkstra最短路径算法实现
* Author: Zhiwen Li 
*   Page: www.zhiwenli.com
*   Email: hi@zhiwenli.com
* Create at: 2016-11-15 09:40:29
* Last Modify: 2016-11-19 20:50:52
**/

//基础类
var Core = {
  /**
  * 获取随机数
  * @paras num of min & max
  * @return random
  **/
	getRandom:function(min, max){
	  var range = max - min;
    var rand = Math.random();
    return(min + Math.round(rand * range));
	},

  /**
  * 判断对象是否为数组
  * @paras array
  * @return boolean
  **/
  isArray: function(obj){
    return Object.prototype.toString.call(obj) === '[object Array]';
  },

  /**
  * 打印矩阵
  * @paras matrix
  **/
  printMatrix: function(g){
    var matrix = g.lzw;
    var str = '';
    var notConnNum = g.notConnNum;
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] == notConnNum) str += "-" + '\t';
        else str += matrix[i][j] + '\t';
      }
      str += '\n';
      //console.log(matrix[i]);
    }
    console.log(str);
  },

  /**
  * 二维矩阵合法性检验，行列数均大于1 & 行列数相同 & 所有元素为数字类型
  * @paras matrix-二维矩阵
  * @return boolean
  **/
  matrixValid: function(matrix){

    if(this.isArray(matrix)){
      var len = matrix.length;

      if(len <= 1){
        console.error("矩阵行/列数需大于1");
        return false;
      }

      for(var i = 0; i < len; i++){

        if (!this.isArray(matrix[i]) || matrix[i].length != len) {console.log(i, matrix[i].length, len);
          console.error("矩阵行/列数不等, 或目标矩阵内包含不是数组的行列");
          return false;
        }

        for (var j = 0; j < len; j++) {
          if(typeof(matrix[i][j]) != 'number'){
            console.error("矩阵中存在非数值类型元素");
            return false;
          }
        }

      }
    }else{
      console.error("目标对象不是矩阵");
      return false;
    }

    return true;
  },

  /**
  * 查找矩阵中的最大值
  * @paras matrix-二维矩阵
  * @return max
  **/
  findMax: function(matrix){
    var max = -1;
    for (var i = 0; i < matrix.length; i++) {
      for (var j = 0; j < matrix[i].length; j++) {
        max = matrix[i][j] > max ? matrix[i][j] : max;
      }
    }
    return max;
  }
}


//图
function G(){
 
}
G.prototype = {
  constructor:G,
  maxOfSideWeight: 99,
  notConnNum: Infinity,
  lzw: new Array(),

  getNumOfNode:function(){
    return this.lzw.length;
  },

  /**
  * 创建随机矩阵，无向图（对称矩阵）,-1表示阻力正无穷即不连通
  * @paras numOfNode, isDirected-是否有向图
  * @return boolean
  **/
  createRandomG: function(isDirected, numOfNode = 8){

    for(var i = 0;i < numOfNode; i++){
     
      this.lzw[i]=new Array();
       
      for(var j = 0; j < numOfNode; j++){

        if (i == j) this.lzw[i][j] = 0;
        else {
          if(Core.getRandom(1, 5)%4 == 0) this.lzw[i][j] = Core.getRandom(1, this.maxOfSideWeight);
          else this.lzw[i][j] = this.notConnNum;
        }
        
        if(!isDirected && i > j) this.lzw[i][j] = this.lzw[j][i];
        
      }
    }
  },

  /**
  * 设置图矩阵
  * @paras
  * @return boolean
  **/
  setG: function(lzwArr){
    if(!Core.matrixValid(lzwArr)){
      console.error("传入矩阵非法");
    }
    this.lzw = lzwArr;
  }
}


//Dijkstra
function Djs(){

}
Djs.prototype = {
  constructor:Djs,
  notConnNum: 0,
  dist: new Array(),
  isVisited: new Array(),

  matrix: new Array(),

  /**
  * 设置矩阵前检查其正确性
  * @para matrix
  **/
  setMatrix: function(matrix){
    if(!Core.matrixValid(matrix)) return;
    this.matrix = matrix;
  },

  /**
  * 初始化
  * @para matrix
  **/
  init: function(matrix){
    this.notConnNum = g.notConnNum;
    this.setMatrix(matrix);
    for (var i = 0; i < this.matrix.length; i++) {
      this.dist[i] = this.notConnNum;
      this.isVisited[i] = false;
    }
  },

  /**
  * 非Dijkstra算法查找最短路径
  * @para start-起始点，matrix
  * @return dist[]-起始点距各点阻力值
  **/
  not_djs: function(start, matrix){
    
    this.init(matrix);

    var min;
    var minLzw = 0;

    this.isVisited[start] = true;
    this.dist[start] = 0;

    for (var k = 0; k < this.matrix.length - 1; k++) {

      min = this.notConnNum;
      for(var i = 0; i < this.matrix.length; i++){

        if(this.isVisited[i]){
          for(var j = 0; j < this.matrix.length; j++){
            if (!this.isVisited[j] && min >= (this.matrix[i][j] + this.dist[i])) {
              min = this.matrix[i][j] + this.dist[i];
              minLzw = j;
            }
          }
        }
          
      }
      this.dist[minLzw] = min;
      this.isVisited[minLzw] = true;
      
    }

    return this.dist;
  },


  /**
  * Dijkstra算法查找最短路径
  * @para start-起始点，matrix
  * @return dist[]-起始点距各点阻力值
  **/
  djs: function(start, matrix){
  
    this.init(matrix);

    this.dist = this.matrix[start];

    var min;
    var minLzw = 0;

    this.isVisited[start] = true;
    this.dist[start] = 0;

    for (var k = 0; k < this.matrix.length - 1; k++) {

      min = this.notConnNum;
      for(var i = 0; i < this.matrix.length; i++){

        if(!this.isVisited[i] && min >= this.dist[i]){
          min = this.dist[i];
          minLzw = i;
        }
      }

      this.isVisited[minLzw] = true;
      for(var j = 0; j < this.matrix.length; j++){
        if(!this.isVisited[j] && this.dist[j] > (this.matrix[minLzw][j] + this.dist[minLzw])){
          this.dist[j] = this.matrix[minLzw][j] + this.dist[minLzw];
        }
      }

    }

    return this.dist;
  }

}


function dijkstra(sourceV, adjMatrix) {
  var POS_INFINITY = Infinity;
  var set = [],
      path = [],
      
      dist = [];
      distCopy = [],
      vertexNum = adjMatrix.length;

  var temp, u,
      count = 0;

  // 初始化
  for (var i = 0; i < vertexNum; i++) {
      distCopy[i] = dist[i] = POS_INFINITY;
      set[i] = false;
  }
  distCopy[sourceV] = dist[sourceV] = 0;

  while (count < vertexNum) {
      u = distCopy.indexOf(Math.min.apply(Math, distCopy));
      set[u] = true;
      distCopy[u] = POS_INFINITY;

      for (var i = 0; i < vertexNum; i++) {
          if (!set[i] && ((temp = dist[u] + adjMatrix[u][i]) < dist[i])) {
              distCopy[i] = dist[i] = temp;
              path[i] = u;
          }
      }
      count++;
  }

  return {
      path: path,
      dist: dist
  };
}


//TEST
for(var num = 3000; num <= 10000; num+=1000){


var g = new G();
g.createRandomG(true, num);
//Core.printMatrix(g);
console.log("\n节点数：", g.getNumOfNode());


var djs;

//console.time("非Dijkstra算法");
//djs = new Djs();
//djs.not_djs(5, g.lzw);
//console.timeEnd("非Dijkstra算法");


console.time("Dijkstra算法");
djs = new Djs();
djs.djs(5, g.lzw);
console.timeEnd("Dijkstra算法");


console.time("CSDN参考Dijkstra");
dijkstra(5, g.lzw);
console.timeEnd("CSDN参考Dijkstra");
}