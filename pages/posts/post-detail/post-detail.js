/**
 * 1. 对于data中的属性a
 * 可以将this.data.a作为右值获取a的值，但不能将其作为左值进行a值的更新
 * 如果要更新需要通过this.setData方法
 * 2. 异步操作是需要配合业务逻辑来进行实现的，脱离业务逻辑谈异步是没有意义的
 * 一般情况下使用同步
 * 3. playBackgroundAudio中的dataUrl和coverImgUrl
 * 必须指定网络路径，不能指定本地路径
 * 4. 使用var that = this是因为success函数中的this已经不再是PageOptions对象了，因为不是PageOptions对象直接调用success函数，所以想要指向PageOptions对象，需要在success函数外用that指向this，再在sucess函数内用that指代this。如果想要知道当前that/this指代的是哪一个对象，可以用鼠标悬浮在上面查看。
 * 5. 谁调用函数，那么函数内部的this指代的就是谁。
 * 6. 函数的同步和异步指的是函数和其他函数之间的执行顺序问题，并不是本函数内部的执行顺序。
 */
var postsData = require('../../../data/posts-data.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var postId  = options.id
    this.setData({ currentPostId: postId })
    var postData = postsData.postList[postId]
    this.setData({postData}) // ES6语法，相当于{postData：postData}
    
    var postsCollected = wx.getStorageSync("posts_collected")
    if(postsCollected){
      var postCollected = postsCollected[postId]
      if(postCollected){
        this.setData({
          collected: postCollected
        })
      }
    }
    else{
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync("posts_collected", postsCollected)
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic: true
      })
    }

    this.setMusicMonitor()


  },

  setMusicMonitor: function(){
    var that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = that.data.currentPostId
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null
    })
    // 解决整首音乐播放完之后按钮和图片不恢复原状的问题
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null
    })
  },
  
  onCollectionTap: function(event){
    this.getPostsCollectedSyc(); // 同步调用
    // this.getPostsCollectedAsy(); // 异步调用

  },

  getPostsCollectedAsy: function(){
    var that = this
    wx.getStorage({
      key: "posts_collected",
      success: function(res){
        var postsCollected = res.data
        var postCollected = postsCollected[that.data.currentPostId]
        // 收藏变未收藏，未收藏变收藏
        postCollected = !postCollected
        postsCollected[that.data.currentPostId] = postCollected

        this.showToast(postsCollected, postCollected)
        // that.showModal(postsCollected, postCollected)
      }
    })
  },

  getPostsCollectedSyc: function(){
    var postsCollected = wx.getStorageSync("posts_collected")
    var postCollected = postsCollected[this.data.currentPostId]
    // 收藏变未收藏，未收藏变收藏
    postCollected = !postCollected
    postsCollected[this.data.currentPostId] = postCollected

    this.showToast(postsCollected, postCollected)
    // this.showModal(postsCollected, postCollected)
  },

  onShareTap: function(event){
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res){
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '现在无法实现分享功能',
        })
      }
    })
  },

  onMusicTap: function(event){
    var currentPostId = this.data.currentPostId
    var postData = postsData.postList[currentPostId]
    var isPlayingMusic = this.data.isPlayingMusic
    if(isPlayingMusic){
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    }
    else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },

  showToast: function (postsCollected, postCollected){
    
    // 更新文章是否搜藏的缓存值
    wx.setStorageSync("posts_collected", postsCollected)
    // 更新数据绑定变量，从而实现图片切换
    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })

  },

  showModal: function (postsCollected, postCollected){
    var that = this
    wx.showModal({
      title: '收藏',
      content: postCollected?"收藏该文章？":"取消收藏该文章？",
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: function(res){
        if(res.confirm){
          // 更新文章是否搜藏的缓存值
          wx.setStorageSync("posts_collected", postsCollected)
          // 更新数据绑定变量，从而实现图片切换
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  // onUnload: function(){
  //   console.log("unload")
  // },

  // onHide: function(){
  //   console.log("unhide")
  // }

})