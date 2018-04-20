var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "userId":"",
    "sexIndex": 0,
    "sex": ["男", "女"],
    "bloodIndex":0,
    "blood": ["A型","B型","AB型","O型","其他"],
    "occupationIndex":0,
    "occupation": ["教师", "医生", "工程师", "公务员", "学生", "市场销售人员", "企业高管", "设计师", "科研人员", "互联网从业者", "律师", "财务会计", "办公室文员", "个体经营者", "作家演员歌手等艺术职业","其他"],
    "date":"",
    "area":"",
    "height":"",
    "weight":"",
    "name":""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkToken()
  
  },
  // 选择性别
  changeSex: function (e) {
    var self = this;
    this.setData({
      sexIndex: e.detail.value
    })
  },
  // 选择血型
  changeBlood: function (e) {
    var self = this;
    this.setData({
      bloodIndex: e.detail.value
    })
  },// 选择职业
  changeOccupation: function (e) {
    var self = this;
    this.setData({
      occupationIndex: e.detail.value
    })
  },
  bindDateChange: function (e) {
    var _this = this;
    this.setData({
      date: e.detail.value
    })
  },
  changeArea: function (e) {
    var _this = this;
    this.setData({
      area: e.detail.value
    })
  },
  changeName:function(e){
    this.setData({
      name: e.detail.value
    })

  },
  changeHeight: function (e) {
    this.setData({
      height: e.detail.value
    })

  },
  changeWeight: function (e) {
    this.setData({
      weight: e.detail.value
    })

  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getInfo()

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
  getInfo: function () {
    var self = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "UserMp/getUserData",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          self.setData({
            userId:res.data.data.user_id,
            name:res.data.data.nickname,
            sexIndex:res.data.data.gender-1,
            date: self.timestampToTime(res.data.data.birthday),
            height:res.data.data.height,
            weight:res.data.data.weight,
            bloodIndex:res.data.data.blood_type-1,
            occupationIndex: res.data.data.occupation-1,
            area:  res.data.data.area.split(",")

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
  timestampToTime:function(timestamp){
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() +' ';
    // h = date.getHours() + ':';
    // m = date.getMinutes() + ':';
    // s = date.getSeconds();
    return Y + M + D ;

  },
  submitData:function(){
    var self=this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "UserMp/saveUserData",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), gender: parseInt(self.data.sexIndex) + 1, nickname: self.data.name, birthday: self.data.date, blood_type: parseInt(self.data.bloodIndex) + 1, height: parseInt(self.data.height), weight: parseInt(self.data.weight), area: self.data.area.join(" "), occupation: parseInt(self.data.occupationIndex)+1 },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          wx.showToast({
            title: "修改成功",
            duration: 2000
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