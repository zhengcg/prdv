var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "date": "",
    "mid":"",
    "id":"",
    "place":"",
    "detail":{
      
    },
    "done":"",
    "yid":""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if(options.id){
      this.setData({
        id: parseInt(options.id),
        mid: parseInt(options.mid),
        index: parseInt(options.index),
        done: parseInt(options.done),
        yid: parseInt(options.yid) > 0 ? parseInt(options.yid):""
      })
    }
    console.log(this.data.yid)
    console.log(options.yid)

    this.checkToken()

  },
  changePlace:function(e){
    this.setData({
      place:e.detail.value
    })

  },

  // 购药时间
  bindDateChange: function (e) {
    var _this = this;
    this.setData({
      date: e.detail.value
    })
  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getDetail();
      if(this.data.done==1){
        this.getInfo()

      }
      



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
  submit:function(){
    var _this = this;
    if (_this.data.date==""){
      wx.showModal({
        title: '提示',
        content: '请选择注射时间',
        showCancel: false
    
      })
    } else if (_this.data.place==""){
      wx.showModal({
        title: '提示',
        content: '请填写注射地点',
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
      url: api + "Corein/addYm",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), place: _this.data.place, m_id: _this.data.mid, vaccine_id: _this.data.id, do_time:_this.data.date,id:_this.data.yid },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {

          wx.navigateTo({
            url: '../vaccineRecord/vaccineRecord?index='+_this.data.index
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

        }  else {
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
  getDetail: function () {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "coreOut/remindYmDetail",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), id:parseInt(_this.data.id)},
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            detail:res.data.data
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

        }  else {
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
  // 获取信息
  getInfo: function () {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "CoreOut/getYmDetail",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), id: parseInt(_this.data.yid) },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            date: res.data.data.do_time.slice(0,10),
            place:res.data.data.place,
            yid: res.data.data.id
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

  },
  goBack:function(){
    var _this=this;
    wx.redirectTo({
      url: '../vaccineRecord/vaccineRecord?index=' + _this.data.index
    })
  }
})