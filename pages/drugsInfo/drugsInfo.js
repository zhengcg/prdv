var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    info:{},
    price:'',
    num:'',
    mid:''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.code){
      this.setData({
        code: options.code,
        mid:options.mid
      })
    }

    this.checkToken()
  
  },
  changePrice:function(e){
    this.setData({
      price:e.detail.value
    })

  },
  changeNum:function(e){
    this.setData({
      num: e.detail.value
    })
  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
        this.getInfo(this.data.code)


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
  getInfo: function (code) {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Ai/readDrug",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'),code:code },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {

          _this.setData({
            info: res.data.data
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
  submit:function(){
    var _this = this;
    if(_this.data.num==""){
      wx.showModal({
        title: '提示',
        content: '请填写数量',
        showCancel: false
      })

    } else if (_this.data.price == ""){
      wx.showModal({
        title: '提示',
        content: '请填写价格',
        showCancel: false
      })
    }else{
      try {
        wx.showLoading()
      }
      catch (err) {
        console.log("当前微信版本不支持")
      }
      wx.request({
        url: api + "Corein/saveYy",
        method: 'POST',
        header: header,
        data: { 
          session_3rd: wx.getStorageSync('token'),
          m_id:_this.data.mid,
          title:_this.data.info.title,
          vender:_this.data.info.vender,
          dosage: _this.data.info.dosage,
          price:_this.data.price,
          amount:_this.data.num
           },
        success: function (res) {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
          if (res.data.code == 200) {

            wx.redirectTo({
              url: '../medicationRecord/medicationRecord?mid='+_this.data.mid+"&path=index"
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})