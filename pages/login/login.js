var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path:"../index/index"
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkToken();    
  },
  checkToken: function () {
    var _this = this;
    wx.checkSession({
      success: function () {
        if (!wx.getStorageSync('token')) {
          _this.registerFn()
        } else {
          wx.switchTab({
            url: _this.data.path
          })
         
        }

      },
      fail: function () {
        _this.registerFn()
      }
    })

  },
  registerFn: function () {
    var _this = this;
    try {
      wx.showLoading({
        title: '请求登录中',
      })
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }

    wx.login({
      success: function (res) {
        if (res.code) {
          _this.getUserInfo(res.code)

        } else {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }

          wx.showToast({
            title: '调微信登录接口失败！',
            icon: 'fail',
            duration: 2000
          })
        }
      }
    });
  },
  sendLogin: function (obj) {
    //发起网络请求
    var _this = this;
    var url = api + 'Usermp/login';
    wx.request({
      url: url,
      method: 'POST',
      header: header,
      data: obj,
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code!==200) {
          
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.setStorageSync('token', "16a4971c0ad8147b0d7f994b529daa46");
              if (wx.getStorageSync('token')){
                console.log("11111"+wx.getStorageSync('token'))
                wx.switchTab({
                  url: _this.data.path
                })
              }
              

            }
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
  getUserInfo: function (code) {
    var _this = this;
    wx.getUserInfo({
      withCredentials: true,
      lang:"zh_CN",
      success: function (res) {
        var sendData = {
          "code": code,
          "nickName": res.userInfo.nickName,
          "gender": res.userInfo.gender,
          "avatarUrl": res.userInfo.avatarUrl,
          "province": res.userInfo.province,
          "city": res.userInfo.city,
          "county": res.userInfo.county
        }
        _this.sendLogin(sendData)

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