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
    "jz_id":"",
    "jzyy":{
      h_id: "",
      yy_title:""
    },
    "jzks":{},
    "isAdd":true
  
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    if(options.jz_id){
      this.setData({
        jz_id: options.jz_id,
        isAdd:false
      })
    }
    
    this.checkToken()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;

  },
  // 切换家属
  changeJs: function (e) {
    var self=this;
    if(self.data.isAdd){
      this.addJz(this.data.members[parseInt(e.detail.current)].id);
    }
    
  },
  // 就诊时间
  bindDateChange: function (e) {
    var _this = this;
    this.setData({
      date: e.detail.value
    })
    
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Corein/saveJz",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), jz_id: _this.data.jz_id, do_time: e.detail.value },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          console.log("添加时间成功！")

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

          if(_this.data.jz_id){
            _this.getJz(_this.data.jz_id)
          }else{
            _this.addJz(_this.data.members[0].id)
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
  // 创建报告列表
  addJz: function (id) {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Corein/addJz",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), m_id: id },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            jz_id:res.data.data.jz_id,
            "date": "",
            "jzyy": {
              h_id: "",
              yy_title: ""
            },
            "jzks": {
              h_son_id:"",
              ks_title:""

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
  getJz:function(id){
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
          for (var i = 0; i < _this.data.members.length; i++) {
            if (_this.data.members[i].id == res.data.data.m_id) {
              _this.setData({
                "index":i,
                "date": (res.data.data.do_time).slice(0, 10),
                "jzyy": {
                  h_id: res.data.data.h_id ? res.data.data.h_id:"",
                  yy_title: res.data.data.yy_title ? res.data.data.yy_title:""
                  
                },
                "jzks":{
                  h_son_id: res.data.data.h_son_id ? res.data.data.h_son_id:"",
                  ks_title: res.data.data.ks_title ? res.data.data.ks_title:""
                }
                            
              });

            }
          }
          setTimeout(function(){
            _this.setData({
              "isAdd": true
              
            })
          },600)
        

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
  gotoAdd:function(){
    wx.navigateTo({
      url: '../addMembers/addMembers?path=uploadReport'
    })
  }
})