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
      { name: '药店', value: 1 },
      { name: '医院', value: 2, checked: 'true'}
    ],
    path:"",
    mid:"",
    "isShowAdd": true
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.mid){
      this.setData({
        path:options.path,
        mid:options.mid

      })
    }else{
      this.setData({
        path: options.path

      })

    }
    if(options.path=="index"){
      this.setData({
        "items": [
          { name: '药店', value: 1, checked: 'true' },
          { name: '医院', value: 2 }
        ]
      })
    }
    this.checkToken()
  
  },
  setClass() {
    for (let i = 0; i < this.data.members.length; i++) {
      let obj = this.data.members[i];
      if (this.data.index - i == 3) {
        obj.class = "itemleft1"
      } else if (this.data.index - i == 2) {
        obj.class = "itemleft2"
      } else if (this.data.index - i == 1) {
        obj.class = "itemleft3"
      } else if (this.data.index - i == 0) {
        obj.class = "itemcenter"
      } else if (this.data.index - i == -1) {
        obj.class = "itemright3"
      } else if (this.data.index - i == -2) {
        obj.class = "itemright2"
      } else if (this.data.index - i == -3) {
        obj.class = "itemright1"
      } else {
        obj.class = ""
      }

    }
    this.setData({ members: this.data.members })
  },
  touchstart(evt) {
    this.data.startX = evt.touches[0].clientX;
  },
  touchmove(evt) {
    if (this.data.startX > 0) {
      if (evt.touches[0].clientX > this.data.startX) {
        if (this.data.index > 0) {
          this.data.index--;
          this.setClass();
          this.setData({
            isShowAdd: true
          })
        }

      } else if (evt.touches[0].clientX < this.data.startX) {
        if (this.data.index < this.data.members.length - 1) {
          this.data.index++;
          this.setClass();
          if (this.data.index == this.data.members.length - 1) {
            this.setData({
              isShowAdd: false
            })
          }
        }

      }
      this.data.startX = -1


    }
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  scanFn:function(){
    var self=this;
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        wx.redirectTo({
          url: '../drugsInfo/drugsInfo?code='+res.result+'&mid='+self.data.members[self.data.index].id
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
          _this.setClass()

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
  
  },
  submit:function(){
    var self=this;
    if(this.data.path=="index"){
      wx.showToast({
        title: '请到我的健康档案查询上传结果',
        icon: 'success',
        duration: 2000,
        success: function () {
          wx.switchTab({
            url: '../index/index',
          })

        }

      })
      

    }else{
      wx.showToast({
        title: '请到我的健康档案查询上传结果',
        icon: 'success',
        duration: 2000,
        success: function () {
          wx.redirectTo({
            url: '../uploadReport/uploadReport?jz_id=' + self.data.jz_id
          })

        }

      })
    }

  },
  gotoAdd: function () {
    wx.navigateTo({
      url: '../addMembers/addMembers?path=medicationRecord'
    })
  }
})