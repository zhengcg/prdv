var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var wxCharts = require('../../utils/wxcharts.js');
var pieChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: '',
    name: '',
    list:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this;
    if (options.mid) {
      this.setData({
        mid: options.mid,
        name: options.name
      })
    }

    
    this.checkToken()

  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getDetail()
    } else {
      wx.showModal({
        title: '提示',
        content: '登录过期了，请重新登录！',
        showCancel: false,
        success: function (res) {
          wx.navigateTo({
            url: '../login/login'
          })
        }
      })
    }
  },
  getDetail: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getJzFy', //仅为示例，并非真实的接口地址
      data: {
        m_id: self.data.mid,
        session_3rd: wx.getStorageSync('token')
      },
      method: 'GET',
      success: function (re) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (re.data.code == 200) {
          var flag=false

          for (var i = 0; i < re.data.data.length;i++){
            if (re.data.data[i]==null){
              re.data.data[i]=0
            }
            re.data.data[i] = parseFloat(re.data.data[i]).toFixed(2)
            if (re.data.data[i]>0){
              flag=true
            }
          }
          if(flag){
            var windowWidth = 320;
            try {
              var res = wx.getSystemInfoSync();
              windowWidth = res.windowWidth;
            } catch (e) {
              console.error('getSystemInfoSync failed!');
            }
            pieChart = new wxCharts({
              animation: true,
              canvasId: 'pieCanvas',
              type: 'pie',
              series: re.data.data,
              width: windowWidth,
              height: 300,
              dataLabel: true,
            });

          }
          

        } else if (res.data.code == 401) {
          wx.clearStorageSync()
          wx.showModal({
            title: '提示',
            content: '登录过期了，请重新登录！',
            showCancel: false,
            success: function (res) {
              wx.redirectTo({
                url: '../login/login'
              })
            }
          })

        }  else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  }
})