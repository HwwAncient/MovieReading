// 此处绝对路径会报错，必须使用相对路径
var postsData = require("../../data/posts-data.js") 

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({ postList: postsData.postList})

  },

  onPostTap: function(event){

    var postId = event.currentTarget.dataset.postid
    console.log(postId)
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  onSwiperTap: function (event) {
    // target和currentTarget
    // target指的是当前点击的组件，而currentTarget指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swipper
    // 这里同样利用了冒泡机制，如果在image组件上使用了catchtap捕获事件的话，那么swipper
    // 就不会再捕获到事件了
    // 因为这里要获取image组件上的属性postid所以使用event.target而非event.currentTarget
    // 这里把事件绑定在swiper组件而非直接绑定在image组件是因为一次绑定即可，不用每张image都绑定
    // 一次
    var postId = event.target.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }

})