var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "members": [],
    "index": 0,
    "date": "",
    "items": [
      { name: '药店', value: 1, checked: 'true' },
      { name: '医院', value: 2}
    ],
    path:"",
    jz_id:""
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.jz_id){
      this.setData({
        path:options.path,
        jz_id:options.jz_id

      })
    }else{
      this.setData({
        path: options.path

      })

    }
    this.checkToken()
  
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  scanFn:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
        wx.navigateTo({
          url: '../drugsInfo/drugsInfo'
        })
      }
    })

  },
  // 切换家属
  changeJs: function (e) {
    var self = this;
    self.setData({
      index: parseInt(e.detail.current)
    })
    // this.addJz(this.data.members[parseInt(e.detail.current)].id);
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
      this.getMembers();
      // 添加就诊（一进来先掉一次，然后实际添加数据调用修改接口）


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
  // 获取家属列表
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
            members: res.data.data
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
  submit:function(){
    var self=this;
    if(this.data.path=="index"){
      wx.switchTab({
        url: '../index/index',
      })

    }else{
      wx.navigateTo({
        url: '../uploadReport/uploadReport?jz_id=' + self.data.jz_id
      })
    }

  },
  gotoAdd: function () {
    wx.navigateTo({
      url: '../addMembers/addMembers?path=medicationRecord'
    })
  }
})