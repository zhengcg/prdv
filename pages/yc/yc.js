var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid:'',
    page:1,
    number:5,
    list: [],
    mni_time: '',
    max_time: ''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mid: options.mid,
      mni_time: options.mni_time,
      max_time: options.max_time
    })

    this.checkToken()
  
  },
  removeFn: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var mid=self.data.mid;
    var imgs = (e.currentTarget.dataset.imgs).splice(index,1)
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
            url: api + "Corein/saveJzYx",
            method: 'GET',
            header: header,
            data: {
              session_3rd: wx.getStorageSync('token'),
              jz_id: id,
              m_id:mid,
              imgs: e.currentTarget.dataset.imgs.toString()

            },
            success: function (res) {
              try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
              if (res.data.code == 200) {
                self.setData({
                  list:[],
                  page: 1
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
  previewImg: function (e) {
    var id = e.currentTarget.dataset.id;
    var arr = [];
    for (var i = 0; i < this.data.list.length; i++) {
      if (this.data.list[i].id == id) {
        arr = this.data.list[i].imgs
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
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
      url: api + 'Coreout/getJzYx', //仅为示例，并非真实的接口地址
      data: {
        number: self.data.number,
        page: self.data.page,
        session_3rd: wx.getStorageSync('token'),
        m_id:parseInt(self.data.mid),
        mni_time: self.data.mni_time,
        max_time: self.data.max_time
      },
      method: 'GET',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.length) {
            for (var i = 0; i < res.data.data.length;i++){
              res.data.data[i].imgs = (res.data.data[i].imgs).split(",")
            }
            self.setData({
              page: self.data.page + 1,
              list: self.data.list.concat(res.data.data),
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

        } else{
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