var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "showMember": {},
    "members": [],
    "index": 0,
    "membersArray":[],
    "date": "",
    "jz_id":"",
    "jzyy":{},
    "jzks":{}
  
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.checkToken()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;

  },
  // 切换家属
  bindPickerChange: function (e) {
    var self=this;
    this.setData({
      index: e.detail.value,
      showMember: self.data.members[e.detail.value],
      date:""
    })
    this.addJz(this.data.members[e.detail.value].id)
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
      data: { session_3rd: wx.getStorageSync('token'), m_id: _this.data.showMember.id, jz_id: _this.data.jz_id, do_time: e.detail.value },
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
          var array=[]
          for (var i = 0; i < res.data.data.length;i++){
            if (res.data.data[i].relation==1){
              array.push("本人")
            } else if (res.data.data[i].relation == 2){
              array.push("儿子")
            } else if (res.data.data[i].relation == 3){
              array.push("女儿")
            } else if (res.data.data[i].relation == 4) {
              array.push("父亲")
            } else if (res.data.data[i].relation == 5) {
              array.push("母亲")
            } else if (res.data.data[i].relation == 6) {
              array.push("配偶")
            }else{
              array.push("其他")
            }

          }
          _this.setData({
            members: res.data.data,           
            membersArray:array
          })
          if (!_this.data.showMember.id){
            _this.setData({
              showMember: res.data.data[0]
            })

          }
          _this.addJz(_this.data.showMember.id)

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
            jz_id:res.data.data.jz_id
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