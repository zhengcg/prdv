var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jz_id: '',
    mid: '',
    GHF:"",
    JCF:"",
    ZYF:"",
    total:""


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      jz_id: options.jz_id
    })
    this.checkToken()

  },
  checkToken: function () {
    var self = this;
    if (wx.getStorageSync('token')) {
      this.getJz(self.data.jz_id);
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
  getJz: function (id) {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Coreout/getJzDetail",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), jz_id: parseInt(id) },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            "mid": res.data.data.m_id
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
  changeGHF:function(e){
    this.setData({
      GHF:parseFloat(e.detail.value),
      total: parseFloat(e.detail.value)+this.data.JCF+this.data.ZYF

    })
    
  },
  changeJCF:function(e){
    this.setData({
      JCF: parseFloat(e.detail.value),
      total: this.data.GHF + parseFloat(e.detail.value) + this.data.ZYF

    })
  },
  changeZYF: function (e) {
    this.setData({
      ZYF: parseFloat(e.detail.value),
      total: this.data.GHF + this.data.JCF + parseFloat(e.detail.value)

    })
  },

  submitBtn: function () {
    var _this = this;
    // if (_this.data.GHF == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入挂号费',
    //     showCancel: false,
    //   })

    // } else if (_this.data.JCF == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入检测费',
    //     showCancel: false,
    //   })

    // } else if (_this.data.ZYF == "") {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入住院费',
    //     showCancel: false,
    //   })
    // } else 
if (parseFloat(_this.data.ZYF) == 0 && parseFloat(_this.data.JCF) == 0 && parseFloat(_this.data.GHF)==0){
      wx.showModal({
        title: '提示',
        content: '请输入费用',
        showCancel: false,
      })

} else if (_this.data.GHF == "" && _this.data.JCF == "" && _this.data.ZYF == ""){
  wx.showModal({
    title: '提示',
    content: '请输入费用',
    showCancel: false,
  })

} else if ( _this.data.JCF >=100000000) {
  wx.showModal({
    title: '提示',
    content: '检测费不能超过100000000',
    showCancel: false,
  })

} else if (_this.data.ZYF >= 100000000) {
  wx.showModal({
    title: '提示',
    content: '住院费不能超过100000000',
    showCancel: false,
  })

}else{

   
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "coreIn/saveJzFy",
      method: 'POST',
      header: header,
      data: { 
        session_3rd: wx.getStorageSync('token'), 
        jz_id: parseInt(_this.data.jz_id), 
        m_id: parseInt(_this.data.mid), 
        price_gh:_this.data.GHF,
        price_jc:_this.data.JCF,
        price_zy:_this.data.ZYF
        },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          wx.showToast({
            title: '请到我的健康档案查询上传结果',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.redirectTo({
                url: '../uploadReport/uploadReport?jz_id=' + _this.data.jz_id
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
  goBack: function () {
    var _this = this;
    wx.redirectTo({
      url: '../uploadReport/uploadReport?jz_id=' + _this.data.jz_id
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