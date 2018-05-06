var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    id:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id: options.id
      })
    }
    this.checkToken()

  },
  setDefault: function (e) {
    var id = parseInt(e.detail.value);
    if(id){
      var self = this;
      try {
        wx.showLoading()
      }
      catch (err) {
        console.log("当前微信版本不支持")
      }
      wx.request({
        url: api + "Address/setDefault",
        method: 'POST',
        header: header,
        data: { session_3rd: wx.getStorageSync('token'), address_id: id },
        success: function (res) {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
          if (res.data.code == 200) {
            self.getList()
            wx.redirectTo({
              url: '../goodsDetail/goodsDetail?id=' + self.data.id
            })

            // self.getList()
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
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getList()

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
  removeAdd: function (e) {
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      success: function (res) {
        if (res.confirm) {
          try {
            wx.showLoading()
          }
          catch (err) {
            console.log("当前微信版本不支持")
          }
          wx.request({
            url: api + "Address/delAddress",
            method: 'GET',
            header: header,
            data: { session_3rd: wx.getStorageSync('token'), address_id: e.target.dataset.id },
            success: function (res) {
              try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
              if (res.data.code == 200) {
                wx.showToast({
                  title: "删除成功！",
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    self.getList()
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
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })




  },
  getList: function () {
    var self = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Address/getAddress",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token') },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          self.setData({
            list: res.data.data
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