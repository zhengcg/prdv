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
    "gyyyTitle": "",
    "items": [
      { name: '医院', value: 2, checked: 'true' }
    ],
    "list": [],
    "mid": "",
    "isYS": 2,
    "code": "",
    "endDate": "",
    "isShowAdd": true,
    "jz_id":""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.path=="index") {

      this.setData({
        "date": options.date,
        "index": options.index,
        "gyyyTitle": options.gyyyTitle,
        "isYS": parseInt(options.isYS),
        "jz_id": parseInt(options.jz_id)
      })

    }else{
      this.setData({
        "date": options.date,
        "gyyyTitle": options.gyyy,
        "jz_id": parseInt(options.jz_id)
      })

    }

    this.checkToken()

  },
  goBack: function () {
    var _this=this;
   wx.navigateTo({
     url: '../uploadReport/uploadReport?jz_id=' + _this.data.jz_id
   })

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
    this.setData({ members: this.data.members });
    if (this.data.date) {
      this.getYYMX()
    } else {
      this.setData({
        list: []
      })
    }
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
    this.setData({
      isYS: parseInt(e.detail.value)
    })

  },
  changeCode: function (e) {
    this.setData({
      code: e.detail.value
    })

  },
  scanFn: function () {
    var self = this;
    if (this.data.code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写国药准字编号',
        showCancel: false
      })

    }else {
      wx.navigateTo({
        url: '../drugsInfo1/drugsInfo1?code=' + self.data.code + '&mid=' + self.data.members[self.data.index].id + '&date=' + self.data.date + '&index=' + self.data.index + '&isYS=' + self.data.isYS + '&gyyyTitle=' + self.data.gyyyTitle+'&jz_id='+self.data.jz_id
      })

    }

  },

  removeYYMM: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
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
            url: api + "CoreIn/deleteYy",
            method: 'GET',
            header: header,
            data: {
              session_3rd: wx.getStorageSync('token'),
              id: id,

            },
            success: function (res) {
              try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
              if (res.data.code == 200) {

                self.getYYMX()

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
  getYYMX: function () {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Coreout/getYy",
      method: 'GET',
      header: header,
      data: {
        session_3rd: wx.getStorageSync('token'),
        m_id: _this.data.members[_this.data.index].id,
        mni_time: _this.data.date,
        max_time: _this.data.date
      },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {

          _this.setData({
            list: res.data.data
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
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getJz(this.data.jz_id);
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
          _this.getMembers(res.data.data.m_id)

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
  // 获取家属列表
  getMembers: function (id) {
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
          for (var i = 0; i < res.data.data.length;i++){
            if (res.data.data[i].id==id){
              _this.setData({
                members: [res.data.data[i]]
              })

            }
          }
          
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
    this.setData({
      endDate: this.formatDate(new Date())
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
  submit: function () {
    var _this=this;
    wx.showModal({
      title: '提示',
      content: '文件已保存，请到健康档案中查询上传结果',
      showCancel: false,
      success: function () {
        wx.redirectTo({
          url: '../uploadReport/uploadReport?jz_id=' + _this.data.jz_id
        })
      }

    })

  },
  gotoAdd: function () {
    wx.navigateTo({
      url: '../addMembers/addMembers?path=medicationRecord'
    })
  }
})