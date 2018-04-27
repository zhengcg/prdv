var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x:0,
    phone:"",
    content:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.checkToken()

  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeIn:function(e){
    this.setData({
      phone:e.detail.value
    })

  },
  changeTe: function (e) {
    this.setData({
      x: e.detail.value.length,
      content: e.detail.value
    })

  },
  submit: function () {
    var self = this;
    if (self.checkPhone(self.data.phone)){
      try {
        wx.showLoading({
          title: '加载中',
        })
      } catch (err) {
        console.log("当前微信版本不支持")
      }
      wx.request({
        url: api + 'help/addOp', //仅为示例，并非真实的接口地址
        data: {
          phone: self.data.phone,
          content: self.data.content,
          session_3rd: wx.getStorageSync('token')
        },
        method: 'POST',
        success: function (res) {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '提交成功！',
              showCancel: false,
              success: function (res) {
                self.setData({
                  phone: "",
                  content: "",
                  x: 0
                })
              }
            })

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

          } else {
            wx.showToast({
              title: "报错了",
              icon: 'fail',
              duration: 2000
            })
          }
        }
      })

    }else{
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false
   
      })
    }
    
  },
  checkPhone:function (phone){ 
    if(!(/^1[34578]\d{9}$/.test(phone))){ 
      return false;
    }else{
      return true
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

  }
})