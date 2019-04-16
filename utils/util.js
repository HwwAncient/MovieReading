// 星星评分专用数组形式表示
function convertToStarsArray(stars){
  var num = stars.toString().substring(0, 1)
  var array = []
  for(var i = 1;i <= 5;i++){
    if(i <= num){
      array.push(1)
    }
    else{
      array.push(0)
    }
  }
  return array
}

/**
 * 1. callBack是一个函数，在success方法中利用callBack回调函数进行赋值等一系列获取到数据后的操作代替直接在success中进行赋值等操作，因为wx.request是一个异步方法。
 * 2. 直接传入一个回调函数也避免使用var that = this等操作调用函数进行数据处理；原因待定，七月老师说callback由success的调用方调用，而success的调用方是小程序内部。
 * 3. var a = http(url)是获取不到值的，因为因为wx.request是一个异步方法。
 */
function http(url, callBack){
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": ""
    },
    success:function(res){
      callBack(res.data)
    },
    fail: function(error){
      console.log(error)
    }
  })

}

function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

// // 测试
// function testThis(){
  
//   this.a = 1
// }

// // 测试
// function b(){

//   this.a =1
// }

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
  // 测试
  // testThis: testThis
}