var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "area": [],
    "name": "",
    "phone":"",
    "address":"",
    "isDefault":false,
    "address_id":"",
    "path":"",
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.address_id){
      this.setData({
        address_id: options.address_id,
        path: options.path
      })
    }else{
      this.setData({
        path: options.path
      })
    }

    if(options.id){
      this.setData({
        id: options.id
      })

    }
    

    this.checkToken()

  },

  changeArea: function (e) {
    var _this = this;
    this.setData({
      area: e.detail.value
    })
  },
  changeName: function (e) {
    this.setData({
      name: e.detail.value
    })

  },
  changePhone: function (e) {
    this.setData({
      phone: e.detail.value
    })

  },
  changeAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
    console.log(e.detail.value)

  },
  switchChange:function(e){
    this.setData({
      isDefault:e.detail.value
    })
    console.log(this.data.isDefault)

  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      if (this.data.address_id){
        this.getAddress(this.data.address_id)
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
  checkPhone: function (phone) {
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      return false;
    } else {
      return true
    }
  },
  getAddress: function (id) {
    var self = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Address/getOne",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), address_id:id },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          self.setData({
            "area": [res.data.data.province_id, res.data.data.city_id, res.data.data.district_id],
            "name": res.data.data.consignee,
            "phone": res.data.data.phone,
            "address": res.data.data.address,
            "isDefault": res.data.data.is_default?true:false,
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
  submitData: function () {
    var self = this;
    if (self.data.name==""){
      wx.showModal({
        title: '提示',
        content: '请输入收货人姓名',
        showCancel: false
      })
    } else if (self.data.phone==""){
      wx.showModal({
        title: '提示',
        content: '请输入手机号码',
        showCancel: false
      })
    } else if (self.data.area.length==0){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
    } else if (self.data.address==""){
      wx.showModal({
        title: '提示',
        content: '请选填写详细地址',
        showCancel: false
      })
    } else if (!self.checkPhone(self.data.phone)){
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号',
        showCancel: false
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '确定提交吗？',
        success: function (res) {
          if (res.confirm) {
            try {
              wx.showLoading()
            }
            catch (err) {
              console.log("当前微信版本不支持")
            }
            wx.request({
              url: api + "Address/addAddress",
              method: 'POST',
              header: header,
              data: {
                session_3rd: wx.getStorageSync('token'),
                consignee: self.data.name,
                phone: self.data.phone,
                address: self.data.address,
                is_default: self.data.isDefault?1:0,
                address_id: self.data.address_id,
                province_id: self.data.area[0],
                city_id: self.data.area[1],
                district_id: self.data.area[2]
              },
              success: function (res) {
                try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
                if (res.data.code == 200) {
                  wx.showToast({
                    title: "保存成功",
                    duration: 2000,
                    success: function () {
                      if (self.data.path=="receiveAd1"){
                        if (self.data.isDefault){
                          wx.redirectTo({
                            url: '../goodsDetail/goodsDetail?id=' + self.data.id
                          })

                        }else{
                          wx.redirectTo({
                            url: '../' + self.data.path + '/' + self.data.path + '?id='+ self.data.id
                          })

                        }
                        

                      }else{
                        wx.redirectTo({
                          url: '../' + self.data.path + '/' + self.data.path
                        })

                      }
                      
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
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
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