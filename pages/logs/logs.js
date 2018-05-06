var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "index":0,
    "tabCur":"1",
    "jkTab":"1",
    "members":[],
    "list":[],
    "showMember":"",
    "yc":[],
    "endDate": "",
    "dateStart":"",
    "dateEnd":""
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.setData({
      showMember: this.data.members[parseInt(this.data.index)],
      dateEnd: this.formatDate(new Date()),
      dateStart: this.lastDate(new Date())
    })  
    this.getDoc(this.data.members[parseInt(this.data.index)].id);
    this.getYc(this.data.members[parseInt(this.data.index)].id)
    
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
        }

      }
      this.data.startX = -1


    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      endDate: this.formatDate(new Date()),
      dateEnd: this.formatDate(new Date()),
      dateStart: this.lastDate(new Date())
    })
  },
  formatDate: function (now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date;
  },
  lastDate: function(now) {
    var year = now.getFullYear()-10;
    var month = now.getMonth()+1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date;
  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getMembers()
      

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
  getMembers:function(){
    var _this=this;
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
            members:res.data.data,
            showMember: res.data.data[0]
          })
          _this.setClass();
          _this.getDoc(res.data.data[0].id)
          _this.getYc(res.data.data[0].id)

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
  getDoc:function(id){
    var self=this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Coreout/getDoc",
      method: 'GET',
      header: header,
      data: { 
        session_3rd: wx.getStorageSync('token'),
        m_id:id,
        mni_time:self.data.dateStart,
        max_time:self.data.dateEnd
         },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          self.setData({
            list:res.data.data
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
  getYc: function (id) {
    var self = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Coreout/getHyBad",
      method: 'GET',
      header: header,
      data: { 
        session_3rd: wx.getStorageSync('token'),
        m_id: id,
        mni_time: self.data.dateStart,
        max_time: self.data.dateEnd
      },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          self.setData({
            yc: res.data.data
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
  // 切换家属
  changeJs: function (e) {
    var self = this;
    console.log(e)
    var index = e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
    this.setClass();
    if (this.data.index == this.data.members.length - 1) {
      this.setData({
        isShowAdd: false
      })
    } else {
      this.setData({
        isShowAdd: true
      })

    }


  },
  changeStart:function(e){
    this.setData({
      dateStart: e.detail.value
    })

  },
  changeEnd: function (e) {
    this.setData({
      dateEnd: e.detail.value
    })

  },
  submitRange:function(){
    this.getDoc(this.data.members[parseInt(this.data.index)].id);
    this.getYc(this.data.members[parseInt(this.data.index)].id)

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
  changeTab:function(e){
    this.setData({
      tabCur: e.currentTarget.dataset.index
    })
  },
  changeJk: function (e) {
    this.setData({
      jkTab: e.currentTarget.dataset.index
    })
  }
})
