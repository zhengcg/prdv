var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    cityListId: '',
    //下面是城市列表信息，这里只是模拟数据
    citylist: [],
    keywords: '',
    isAddYY: true,
    date: '',
    index: '',
    imgs:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: options.date,
      index: options.index,
      imgs:options.imgs
    })

    this.checkToken()

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
    // this.getList()

  },
  //点击城市字母
  letterTap(e) {
    const Item = e.currentTarget.dataset.item;
    this.setData({
      cityListId: Item
    });
  },
  sendMsg: function (e) {
    if (e.detail.value) {
      this.setData({
        keywords: e.detail.value

      })
      this.getList()
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入搜索关键词',
        showCancel: false
      })
    }

  },
  addYY: function () {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'coreIn/addHospital', //仅为示例，并非真实的接口地址
      data: {
        session_3rd: wx.getStorageSync('token'),
        title: self.data.keywords
      },
      method: 'POST',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          self.setData({
            isAddYY: true
          })
          self.getList()



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
      }
    })

  },
  cancelAdd: function () {
    this.setData({
      isAddYY: true

    })
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
    (function iterator(i) {
      if (i == 7) {
        return;
      }
      wx.request({
        url: api + 'Coreout/getHospital', //仅为示例，并非真实的接口地址
        data: {
          session_3rd: wx.getStorageSync('token'),
          keywords: self.data.keywords,
          storg: i
        },
        method: 'GET',
        success: function (res) {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
          if (res.data.code == 200) {
            if (res.data.data.length > 0) {
              if (i == 1) {
                self.setData({
                  citylist1: res.data.data
                })

              } else if (i == 2) {
                self.setData({
                  citylist2: res.data.data
                })

              } else if (i == 3) {
                self.setData({
                  citylist3: res.data.data
                })

              } else if (i == 4) {
                self.setData({
                  citylist4: res.data.data
                })

              } else if (i == 5) {
                self.setData({
                  citylist5: res.data.data
                })

              } else if (i == 6) {
                self.setData({
                  citylist6: res.data.data
                })

              }

              iterator(i + 1)


            } else {
              self.setData({
                citylist: res.data.data,
                isAddYY: false
              })
              iterator(i + 1)

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

          } else {
            wx.showToast({
              title: "系统错误",
              icon: 'fail',
              duration: 2000
            })
          }
        }
      })

    })(1)

  },
  selectHos: function (e) {
    var _this = this;
    wx.redirectTo({
      url: '../physicaRecords/physicaRecords?index=' + _this.data.index + '&date=' + _this.data.date + '&imgs=' + _this.data.imgs + '&yy=' + e.currentTarget.dataset.id +'&gyyyTitle=' + e.currentTarget.dataset.title
    })

  }
})