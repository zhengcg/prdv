var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur:"1",
    "jkTab":"1"
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkToken()


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {




  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      console.log("有token")

    } else {
      wx.navigateTo({
        url: '../login/login'
      })

    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  changeTab:function(e){
    this.setData({
      tabCur: e.currentTarget.dataset.index
    })
  },
  changeJk: function (e) {
    this.setData({
      jkTab: e.currentTarget.dataset.index
    })
  }
})
