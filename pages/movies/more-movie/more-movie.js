/**
 * 1. 请求服务器数据不指定请求多少条数据和从哪条数据开始请求时，一般服务器从0开始返回20条
 * 2. 利用在异步函数中callBack回调函数进行赋值代替同步方法赋值
 * 3. 尽管在同一个页面内，方法间相互调用也要使用this关键字
 */
/**
 * 实现上滑加载，下拉刷新操作：
 * 如果页面包含scroll-view组件（可用来实现上滑加载功能）则此处无法实现下拉刷新（具体原因课件知
 * 乎）
 * 如果不在各自的响应函数中写具体操作，二者都不会有具体操作，只是显示样式而已（如下拉时，并不会自
 * 动重新加载整个页面，而是执行下拉事件响应函数中的内容，不同于网页中的刷新按钮）
 * 1. 上滑加载
 * 通过wx的两个api进行显示和隐藏
 * 实现方式有多种，其中一种是通过scroll-view组件的bindscrolltolower事件响应函数来调用显示api
 * 回调函数需要自己绑定到组件即设置bindscrolltolower属性的值;第二种是通过onReachBottom响应函数
 * 来实现
 * 2. 下拉刷新
 * 通过在json文件中配置"enablePullDownRefresh": true实现（true为布尔类型不要加双引号）
 * 显示的话只要下拉操作就可以显示，但是要关闭的话得用wx的api进行关闭，否则要等到了默认时间才会自动消失样式
 * onPullDownRefresh回调函数不需要自己绑定到组件
 * 若不设置"enablePullDownRefresh":true，则模拟器上无法下拉出窗口但真机上可以，实际上这个配置的
 * 作用并不是能够下拉显示窗口，窗口下拉一直可以在真机上显示，它的作用是为了显示刷新的那三个小点。
 * 只有设置了，真机和模拟器上下拉时才会显示，不调用api默认时间关闭
 */
var util = require('../../../utils/util.js')
var app = getApp()

Page({

  data: {
    navigateTitle: "",
    movies: {},
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },

  onLoad: function(options) {
    var category = options.category
    this.setData({
      navigateTitle: category
    })
    var dataUrl = ""
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters'
        break
      case "即将上映":
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon'
        break
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250'
        break

    }
    this.setData({
        requestUrl: dataUrl
    })

    util.http(dataUrl, this.processDoubanData)

    // // 以下代码为测试使用
    // util.testThis()
    // console.log(util.a)
  },

  // 跳转到电影详情界面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },

  processDoubanData: function(moviesDouban) {

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

    var totalMovies = {}

    // 如果要绑定新加载的数据，需要同旧绑定的数据进行合并
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies)
    }
    else{
      totalMovies = movies
      this.setData({
        isEmpty: false
      })
    }

    this.setData({
      movies: totalMovies
    })

    this.setData({
      totalCount: this.data.totalCount + 20
    })

    // 停止显示上滑加载样式（不手动设置有默认时长）
    wx.hideNavigationBarLoading()
    // 停止显示下拉刷新样式（不手动设置有默认时长）
    wx.stopPullDownRefresh()
  },

  // 上滑加载
  onReachBottom: function(){
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  // onScrollLower: function(event){
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"
  //   util.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading()
  // },

  // 下拉刷新：该响应函数不需要自己绑定到组件，自动触发
  onPullDownRefresh: function(){
    var refreshUrl = this.data.requestUrl + "?star=0&count=20"
    this.setData({
      movies: {},
      isEmpty: true,
      totalCount: 0
    })

    util.http(refreshUrl ,this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  // 动态设置导航栏样式必须在onReady函数中设置，即在页面渲染完成之后设置，否则样式会被覆盖; 静态设置是在json文件中配置
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }

})