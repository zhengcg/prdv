var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: '',
    page: 1,
    number: 15,
    list: [],
    mni_time: '',
    max_time: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mid) {
      this.setData({
        mid: options.mid,
        mni_time: options.mni_time,
        max_time: options.max_time
      })
    }

    this.checkToken()

  },
  removeFn: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {



          try {
            wx.showLoading()
          }
          catch (err) {
            console.log("当前微信版本不支持")
          }
          wx.request({
            url: api + "CoreIn/saveJz",
            method: 'GET',
            header: header,
            data: {
              session_3rd: wx.getStorageSync('token'),
              jz_id: id,
              h_son_id:0

            },
            success: function (res) {
              try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
              if (res.data.code == 200) {

                self.data.list.splice(index, 1);
                self.setData({
                  list: self.data.list
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getList: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getJzKs', //仅为示例，并非真实的接口地址
      data: {
        m_id: self.data.mid,
        number: self.data.number,
        page: self.data.page,
        session_3rd: wx.getStorageSync('token'),
        mni_time: self.data.mni_time,
        max_time: self.data.max_time
      },
      method: 'GET',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].do_time = res.data.data[i].do_time.slice(0, 10)
            }

            self.setData({
              page: self.data.page + 1,
              list: self.data.list.concat(res.data.data)
            })
          } else {
            wx.showToast({
              title: '没有了！',
              icon: 'fail',
              duration: 2000
            })
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
    this.getList()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})