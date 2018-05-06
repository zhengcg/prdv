var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var imgSrc = app.globalData.imgSrc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "img":"",
    "date": "",
    "index": 0,
    "membersArray": ["本人","儿子","女儿","父亲","母亲", "配偶","其他"],
    "name":"",
    "path":"",
    "id":"",
    "isShowBtn":false,
    "endDate": "",
    "indexs":""
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.path){
      this.setData({
        path: options.path
      })

    }else{
      this.setData({
        id: options.id,
        isShowBtn:true,
        indexs:options.index
      })
    }
    if (this.data.indexs!=="0"){
      this.setData({
        "membersArray": [ "儿子", "女儿", "父亲", "母亲", "配偶", "其他"],

      })
    }else{
      this.setData({
        "membersArray": ["本人"]

      })

    }
   
    this.checkToken()
  
  },
  // 选择关系
  bindPickerChange: function (e) {
    var self = this;
    this.setData({
      index: e.detail.value
    })
  },
  // 就诊时间
  bindDateChange: function (e) {
    var _this = this;
    this.setData({
      date: e.detail.value
    })
  },
  changeName:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  chooseImg: function () {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        wx.uploadFile({
          url: api + 'Corein/coreUpload',
          filePath: tempFilePaths[0],
          name: 'imgs',
          formData: {
            session_3rd: wx.getStorageSync('token')
          },
          success: function (res) {
            console.log(JSON.parse(res.data).data.img_url)
              self.setData({
                img: imgSrc+JSON.parse(res.data).data.img_url
              })
            
            
          }
        })





      }
    })
  },
  submitBtn:function(){
    var self = this;
    var relation;
    if(self.indexs==0){
      relation=parseInt(self.data.index) + 1
    }else{
      relation = parseInt(self.data.index) + 2
    }
    if (self.data.name==""){
      wx.showModal({
        title: '提示',
        content: '请填写昵称',
        showCancel: false
      })
    } else if (self.data.date==""){
      wx.showModal({
        title: '提示',
        content: '请填写生日',
        showCancel: false
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '确定提交吗？',
        showCancel: false,
        success:function(){
          try {
            wx.showLoading()
          }
          catch (err) {
            console.log("当前微信版本不支持")
          }
          wx.request({
            url: api + "UserMp/addMembers",
            method: 'POST',
            header: header,
            data: { session_3rd: wx.getStorageSync('token'), name: self.data.name, img: self.data.img, birthday: self.data.date, relation: relation },
            success: function (res) {
              try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
              if (res.data.code == 200) {
                wx.showToast({
                  title: "添加成功",
                  duration: 2000,
                  success: function () {
                    wx.redirectTo({
                      url: '../' + self.data.path + '/' + self.data.path
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

        }
      })

    }
 

  },
  editBtn:function(){
    var self = this;
    var relation;
    if (self.indexs == 0) {
      relation = parseInt(self.data.index) + 1
    } else {
      relation = parseInt(self.data.index) + 2
    }
    if (self.data.name == "") {
      wx.showModal({
        title: '提示',
        content: '请填写昵称',
        showCancel: false
      })
    } else if (self.data.date == "") {
      wx.showModal({
        title: '提示',
        content: '请填写生日',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定提交吗？',
        showCancel: false,
        success: function () {
          try {
            wx.showLoading()
          }
          catch (err) {
            console.log("当前微信版本不支持")
          }
          wx.request({
            url: api + "UserMp/addMembers",
            method: 'POST',
            header: header,
            data: { session_3rd: wx.getStorageSync('token'), name: self.data.name, img: self.data.img, birthday: self.data.date, relation: relation , m_id: parseInt(self.data.id) },
            success: function (res) {
              try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
              if (res.data.code == 200) {
                wx.showToast({
                  title: "保存成功",
                  duration: 2000,
                  success: function () {
                    wx.redirectTo({
                      url: '../memberOfFamily/memberOfFamily'
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

        }
      })

    }

  },
  delBtn:function(){
    var self = this;

      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        showCancel: false,
        success: function () {
          try {
            wx.showLoading()
          }
          catch (err) {
            console.log("当前微信版本不支持")
          }
          wx.request({
            url: api + "usermp/deleteMembers",
            method: 'POST',
            header: header,
            data: { session_3rd: wx.getStorageSync('token'), m_id: parseInt(self.data.id) },
            success: function (res) {
              try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
              if (res.data.code == 200) {
                wx.showToast({
                  title: "删除成功",
                  duration: 2000,
                  success: function () {
                    wx.navigateTo({
                      url: '../memberOfFamily/memberOfFamily'
                    })
                  }
                })

              } else if (res.data.code == 400){
                wx.showToast({
                  title: "不能删除本人",
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

        }
      })


  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      if(this.data.id){
        this.getInfo(this.data.id)
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

  getInfo:function(id){
    var self = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "UserMp/getMember",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), id:parseInt(id)},
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          var relation;
          if(self.data.indexs!=="0"){
            relation = res.data.data.relation - 2
          }else{
            relation = res.data.data.relation - 1
          }
          self.setData({
            "img": res.data.data.img,
            "date": self.timestampToTime(res.data.data.birthday),
            "index": relation,
            "name": res.data.data.name

          })
          console.log(self.data.index)

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
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    // h = date.getHours() + ':';
    // m = date.getMinutes() + ':';
    // s = date.getSeconds();
    return Y + M + D;

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
  
  }
})