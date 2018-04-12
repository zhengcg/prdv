var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "showMember": {},
    "members": [],
    "main":0,
    "isShow":true,
    "x":0,
    "text":"加油！明天再来",
    "isSign":""
  
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
      this.getMembers()
      this.getMain()
      this.signIn()


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
  getMembers: function () {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "UserMp/getMembers",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token') },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            members: res.data.data,
            showMember: res.data.data[0]
          })
         

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          })

        }
      },
      fail: function () {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        wx.showToast({
          title: '接口调用失败！',
          icon: 'fail',
          duration: 2000
        })
      }
    })
  },
  getMain:function(){
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "UserMp/getMain",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token') },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            main: res.data.data.score
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          })

        }
      },
      fail: function () {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        wx.showToast({
          title: '接口调用失败！',
          icon: 'fail',
          duration: 2000
        })
      }
    })

  },
  signIn:function(){
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Sign/isAlreadySignIn",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token') },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if(res.data.data==1){
            _this.setData({
              isSign: "签到"
            })
          }else{
            _this.setData({
              isSign:"已签到"
            })
          }

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'fail',
            duration: 2000
          })

        }
      },
      fail: function () {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        wx.showToast({
          title: '接口调用失败！',
          icon: 'fail',
          duration: 2000
        })
      }
    })


  },
  sign:function(){
   
    var _this = this;
    if (_this.data.isSign=="签到"){
      try {
        wx.showLoading()
      }
      catch (err) {
        console.log("当前微信版本不支持")
      }
      wx.request({
        url: api + "Sign/signIn",
        method: 'GET',
        header: header,
        data: { session_3rd: wx.getStorageSync('token') },
        success: function (res) {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
          if (res.data.code == 200) {
            var text = "加油！明天再来";
            if (res.data.data.score > 2) {
              text = "哎哟！还不错"
            } else if (res.data.data.score > 4) {
              text = "这手气！忒棒了"
            } else {
              text = "加油！明天再来";
            }
            _this.setData({
              x: res.data.data.score,
              isShow: false,
              text: text
            })
            _this.getMain()
            _this.signIn()


          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'fail',
              duration: 2000
            })

          }
        },
        fail: function () {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
          wx.showToast({
            title: '接口调用失败！',
            icon: 'fail',
            duration: 2000
          })
        }
      })

    }
    


  },
  hideShow:function(){
    this.setData({
      isShow: true
    })
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