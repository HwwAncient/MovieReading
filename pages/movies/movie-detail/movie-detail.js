/**
 * 1. 一般需要对从服务器请求回的数据进行判空操作（提供容错机制），但不是每个属性都要进行，一般通  * 过尝试进行，一般需要对二级属性进行判空，因为它若为空则当引用其子属性时就会报错。
 * 2. wx.previewImage提供大图查看预览功能
 * 3. class和箭头函数和匿名函数的使用
 */
import { Movie } from 'class/Movie.js';
var util = require('../../../utils/util.js')
var app = getApp()
Page({


  data: {
    movie: {}
  },

  onLoad: function(options) {
    var movieId = options.id
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId
    
    // 方法一：用本页面函数
    // util.http(url, this.processDoubanData)

    // 方法二：用class类+匿名函数
    // 因为此处匿名函数内部this的指向发生改变，所以用了that
    var movie = new Movie(url);
    var movieData = movie.getMovieData();
    var that = this;
    movie.getMovieData(function (movie) {
      that.setData({
        movie: movie
      })
    })

    // 方法三：用class类+箭头函数
    // 使用了箭头函数就不需要使用that了
    // 箭头函数的环境是定义函数时的环境而不是调用时的环境
    // 虽然箭头函数并没有定义在getMovieData的函数体里而只是定义在了getMovieData函数调用的参数
    // 列表中；箭头函数真正定义的是在onload函数体中，所以箭头函数中的this和onload函数中的this是
    // 一样的。
    // 箭头函数中并没有自己真正的this，可以理解它的this都是继承父函数的。
    // C#、Java、Python lambda
    // movie.getMovieData((movie) => {
    //   this.setData({
    //     movie: movie
    //   })
    // })

  },

  // 主要进行判空操作再绑定数据
  processDoubanData: function(data) {
    if (!data) {
      return
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    }
    var movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie: movie
    })
  },

  /*查看图片*/
  viewMoviePostImg: function(e) {
    var src = e.currentTarget.dataset.src
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  }

})