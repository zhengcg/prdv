var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var imgSrc = app.globalData.imgSrc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "members": [],
    "index": 0,
    "date": "",
    "imgs": [],
    "yy":"",
    "endDate":"",
    "gyyyTitle":""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.index){
      console.log(options.imgs)
      this.setData({
        imgs: options.imgs==""?[]:options.imgs.split(","),
        index:options.index,
        date:options.date,
        yy:parseInt(options.yy),
        gyyyTitle: options.gyyyTitle
      })
    }
    this.checkToken()

  },
  previewImg: function (e) {
    var self = this;
    var index = e.currentTarget.dataset.index;

    wx.previewImage({
      current: self.data.imgs[index], // 当前显示图片的http链接
      urls: self.data.imgs // 需要预览的图片http链接列表
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
    this.setData({ members: this.data.members })
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
  },
  changeYY:function(e){
    this.setData({
      yy:e.detail.value
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
  chooseImg: function () {
    var self = this;
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        for (var i = 0; i < tempFilePaths.length; i++) {
          wx.uploadFile({
            url: api + 'Corein/coreUpload',
            filePath: tempFilePaths[i],
            name: 'imgs',
            formData: {
              session_3rd: wx.getStorageSync('token')
            },
            success: function (res) {
              var array = imgSrc + JSON.parse(res.data).data.img_url
              self.setData({
                imgs: self.data.imgs.concat(array)
              })
            }
          })

        }





      }
    })
  },
  removeImg: function (e) {
    var self = this;
    self.data.imgs.splice(e.target.dataset.index, 1)
    self.setData({
      imgs: self.data.imgs
    })

  },
  submit:function(){
    var _this = this;
    if (_this.data.imgs.length== 0) {
      wx.showModal({
        title: '提示',
        content: '请先上传后在保存',
        showCancel: false,

      })

    } else if (_this.data.date=="") {
      wx.showModal({
        title: '提示',
        content: '请选择就诊时间',
        showCancel: false,

      })
      
    } else if (_this.data.yy == "") {
      wx.showModal({
        title: '提示',
        content: '请填写医院或体检中心',
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
      url: api + "CoreIn/addTj",
      method: 'POST',
      header: header,
      data: { 
        session_3rd: wx.getStorageSync('token'),
        place:_this.data.yy,
        m_id: _this.data.members[_this.data.index].id,
        imgs:_this.data.imgs.toString(),
        do_time:_this.data.date
         },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '文件已保存，请到健康档案中查询上传结果',
              showCancel: false,
              success: function () {
                wx.switchTab({
                  url: '../index/index',
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
  gotoAdd: function () {
    wx.redirectTo({
      url: '../addMembers/addMembers?path=physicaRecords'
    })
  },
  gotoJZYY:function(){
    var self=this;
    wx.redirectTo({
      url: '../jzyy2/jzyy2?index=' + self.data.index + '&date=' + self.data.date + '&imgs=' + (self.data.imgs).toString(),
    })

  }
})