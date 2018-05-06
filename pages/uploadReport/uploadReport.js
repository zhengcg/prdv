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
    "jzks":{
      h_son_id: "",
      ks_title: ""
    },
    "ksList":[],
    "ksIndex":0,
    "isAdd":true,
    "endDate":""
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
      ksList:[]
    })
    if (this.data.isAdd) {
      this.addJz(this.data.members[this.data.index].id);
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
        }

      } else if (evt.touches[0].clientX < this.data.startX) {
        if (this.data.index < this.data.members.length - 2) {
          this.data.index++;
          this.setClass();
        }

      }
      this.data.startX = -1


    }
  },
  // 切换家属
  // 切换家属
  changeJs: function (e) {
    var self = this;
    console.log(e)
    var index = e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
    this.setClass();



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
  // 选择科室
  bindChangeKS:function(e){
   
    var _this = this;
    this.setData({
      ksIndex: e.detail.value
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
      data: { session_3rd: wx.getStorageSync('token'), jz_id: _this.data.jz_id, h_son_id: _this.data.ksList[_this.data.ksIndex].id },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          console.log("添加科室成功！")

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
      
          var arr = res.data.data;
          arr.push({})
          _this.setData({
            members: arr   
          })
          _this.setClass();

          if(_this.data.jz_id){
            _this.getJz(_this.data.jz_id)
          }else{
            _this.addJz(_this.data.members[0].id)
          }
         

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
  // 创建报告列表
  addJz: function (id) {
    var _this = this;

    wx.request({
      url: api + "Corein/addJz",
      method: 'POST',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), m_id: id },
      success: function (res) {

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
              if (res.data.data.h_id){
                _this.getKSList(res.data.data.h_id)
              }
              _this.setClass();
              

            }
          }
          setTimeout(function(){
            _this.setData({
              "isAdd": true
              
            })
          },600)
        

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
  getKSList:function(id){
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Coreout/getDepartment",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), pid: parseInt(id) },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            ksList:res.data.data
          })
          if (_this.data.jzks.h_son_id){
            for (var i = 0; i < res.data.data.length;i++){
              if (res.data.data[i].id == _this.data.jzks.h_son_id){
                _this.setData({
                  ksIndex: i
                })
              }
            }
          }

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
    wx.redirectTo({
      url: '../addMembers/addMembers?path=uploadReport'
    })
   
  },
  gotoHYD:function(){
    var self=this;
    if(this.data.date==""){
      wx.showModal({
        title: '提示',
        content: '请先选择就诊时间',
        showCancel: false
      })

    } else if (this.data.jzyy.yy_title==""){
      wx.showModal({
        title: '提示',
        content: '请先选择就诊医院',
        showCancel: false
      })

    }else{
      wx.redirectTo({
        url: '../uploadHYD/uploadHYD?jz_id='+self.data.jz_id,
      })

    }
  },
  gotoYXBG: function () {
    var self = this;
    if (this.data.date == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊时间',
        showCancel: false
      })

    } else if (this.data.jzyy.yy_title == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊医院',
        showCancel: false
      })

    } else {
      wx.redirectTo({
        url: '../uploadYXBG/uploadYXBG?jz_id=' + self.data.jz_id,
      })

    }
  },
  gotoCFD: function () {
    var self = this;
    if (this.data.date == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊时间',
        showCancel: false
      })

    } else if (this.data.jzyy.yy_title == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊医院',
        showCancel: false
      })

    } else {
      wx.redirectTo({
        url: '../uploadCFD/uploadCFD?jz_id=' + self.data.jz_id,
      })

    }
  },
  gotoBLJL: function () {
    var self = this;
    if (this.data.date == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊时间',
        showCancel: false
      })

    } else if (this.data.jzyy.yy_title == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊医院',
        showCancel: false
      })

    } else {
      wx.redirectTo({
        url: '../uploadBLJL/uploadBLJL?jz_id=' + self.data.jz_id,
      })

    }
  },
  gotoYYJL: function () {
    var self = this;
    if (this.data.date == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊时间',
        showCancel: false
      })

    } else if (this.data.jzyy.yy_title == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊医院',
        showCancel: false
      })

    } else {
      wx.redirectTo({
        url: '../medicationRecord1/medicationRecord1?jz_id=' + self.data.jz_id + '&date=' + self.data.date + '&gyyy=' + self.data.jzyy.yy_title,
      })

    }
  },
  gotoPAY: function () {
    var self = this;
    if (this.data.date == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊时间',
        showCancel: false
      })

    } else if (this.data.jzyy.yy_title == "") {
      wx.showModal({
        title: '提示',
        content: '请先选择就诊医院',
        showCancel: false
      })

    } else {
      wx.redirectTo({
        url: '../pay/pay?jz_id=' + self.data.jz_id,
      })

    }
  }
})