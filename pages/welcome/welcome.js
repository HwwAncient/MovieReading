/**
 * 1. 使用navigateTo到达下一个页面后是可以返回上一个页面的，返回之前上一个页面的生命周期是
 * hide，返回之后下一个页面的生命周期是unload
 * 2. 使用redirectTo到达下一个页面后是不能返回上一个页面的，上一个页面的生命周期直接就是
 * unload
 * 3. 如果下一个页面有tab的话，那么上面两种方法都不能用，只能用switchTab方法跳转
 * 但是如果下一个页面没有tab，该跳转方法不会生效
 * 4. Tab切换页面，未显示的页面只是隐藏，并未卸载
 * 5. 要确定一个页面有没有卸载或者是隐藏，可以看调制器中的AppData项，如果这个页面隐藏，
 * 那么这个页面的绑定数据还是会存在，如果页面卸载那么这个页面的绑定数据就不存在了
 * 6. 用this.data可以获取data中绑定的数据，但是要更新data中绑定的数据只能用this.setData方法，用this.data直接更新无效
 * 7. js三大难点：原型链，this指针，异步回调
 * 8. 要调试js代码的话在Sources页面调试，选带[sm]后缀的js进行断点调试；因为就算在打断点在没有
 * [sm]的js，调试的时候也会自动跳到带[sm]的js
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onTap: function(){
    // wx.navigateTo({
    //   url: '../posts/posts',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
    // catch绑定：非冒泡；bind绑定：冒泡

    // wx.redirectTo({
    //   url: '../posts/post',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })

    wx.switchTab({
      url: '../posts/post',
    })


  }
})