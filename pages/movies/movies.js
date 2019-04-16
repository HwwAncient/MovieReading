// 1. wx.request方法是异步的，多个 wx.request打印请求结果不知道谁先谁后输出
// 2. 在已知item的数量且不多的情况下可以不用wx:for，直接使用template重复几次就好了
// 3. 用var data = this.getMovieListData(inTheatersUrl)是获取不到数据的，getMovieListData虽然是一个同步方法，但是里面的wx.request是一个异步方法。获取数据必须要写在wx.request内部的success方法中
// 4. js中for(var i in [1,2,3])依次输出的是0,1,2即迭代对象中的序号而非迭代对象的值1,2,3
// 5. 在不同页面间传递数据的四种方式：缓存传递，全局变量传递，url传递，事件传递（如果传递的是对象的话可以试试事件传递）另：在同一页面的不同函数之间传递还可以通过对data的存取进行传递
// 6.真机上的缓存和开发工具上的缓存机制好像不同，不能一键清除所有缓存，如有错误可能是缓存引起的（需试验）
// 7. 小程序中的缓存如果没有手动清除将一直存在，没有时间限制会自动清除
// 8. 注意bindblur,bindchange,bindconfirm区别，最好使用bindconfirm（点击真机键盘上"完成"时触发事件）
// 9. TODO 退出搜索页面后去除input输入框中的字

var util = require('../../utils/util.js')
var app = getApp()
Page({

  // RESTFUL API JSON
  // SOAP XML
  // 粒度

  data: {

    // 尽管后面会赋值，但此处最好要用空对象初始化数据，因为后面的方法赋值是异步的，所以很可能初始化页面的时候这三个值还没有被设置导致页面找不到这个三个值从而无法初始化页面(不初始化只能说情况不确定,不能说一定无法显示)
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
    inputValue:""
  },

  onLoad: function(options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3"
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3"
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3"

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映")
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映")
    this.getMovieListData(top250Url, "top250", "豆瓣Top250")

  },

  getMovieListData: function(url, settedKey, categoryTitle) {

    var that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res)
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function(error) {
        console.log(error)
      },
    })
  },

  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {

    var movies = []
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }

      // stars数组样式：5颗星[1,1,1,1,1] 3颗星[1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }

    // 利用JS动态语言的特性赋值（高级用法）
    var readyData = {}
    // 此处再加上一层movies包裹，因为movie-list-template中的template只能接受movies这一个绑定数据key
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData)
  },

  // 因为模板template只能模板wxml和wxss，template中的js是不会运行的，所以事件响应的js代码还是写在这里，但捕获事件还是写在template中。自定义组件component可以解决这个问题，将所有文件模板化
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },

  // 跳转到电影详情界面
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  },

  onBindFocus: function(){
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindConfirm: function(event){
    var text = event.detail.value
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text
    this.getMovieListData(searchUrl, 'searchResult', '')
  },

  onCancelImgTap: function(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue:""
    })
  

  }

})