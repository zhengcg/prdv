var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
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
    "path":""
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      path:options.path
    })
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
                img: "https://appdev.qigle.com/wangwang/"+JSON.parse(res.data).data.img_url
              })
            
            
          }
        })





      }
    })
  },
  submitBtn:function(){
    var self = this;
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
      data: { session_3rd: wx.getStorageSync('token'), name: self.data.name, img: self.data.img, birthday: self.data.date, relation:parseInt(self.data.index)+1 },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          wx.showToast({
            title: "添加成功",
            duration: 2000
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
  checkToken: function () {
    if (wx.getStorageSync('token')) {

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