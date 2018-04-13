var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isYDZ:false,
    list: [],
    isDefaultAdd:{},
    isShow: true,
    goodsId:"",
    detail:{},
    main:0,
    num:1,
    conNum:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id){
      this.setData({
        goodsId: options.id
      })
    }
    this.checkToken()

  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getList();
      this.getDetail(this.data.goodsId);
      this.getMain()

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
  hideShow: function () {
    this.setData({
      isShow: true
    })
  },
  changeAdd:function(){
    this.setData({
      isShow: false
    })
  },
  selectAdd:function(e){
    this.setData({
      isDefaultAdd: this.data.list[e.currentTarget.dataset.index]
    })

  },
  plusNum:function(){
    if (this.data.num < this.data.detail.quantity){
      this.setData({
        num: this.data.num+1,
        conNum: (this.data.num+1)*this.data.detail.score
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '库存不足',
        showCancel: false
      })
    }

  },
  minusNum: function () {
    if (this.data.num >1) {
      this.setData({
        num: this.data.num - 1,
        conNum: (this.data.num - 1) *this.data.detail.score
      })
    }

  },
  getMain: function () {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "UserMp/getMain",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token') },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          _this.setData({
            main: res.data.data.score
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

  getList: function () {
    var self = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Address/getAddress",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token') },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.length>0){
            var df={};
            for (var i = 0; i < res.data.data.length;i++){
              if (res.data.data[i].isDefault==1){
                df = res.data.data[i]
              }else{
                df = res.data.data[0]
              }
            }
            self.setData({
              list: res.data.data,
              isYDZ:true,
              isDefaultAdd:df
            })

          }
          

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
  getDetail: function (id) {
    var self = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "Goods/getOne",
      method: 'GET',
      header: header,
      data: { session_3rd: wx.getStorageSync('token'), goods_id:id },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          self.setData({
            detail:res.data.data,
            conNum: res.data.data.score
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
  duiFn:function(){
   
    var self = this;
    if (self.data.conNum>self.data.main){
      wx.showModal({
        title: '提示',
        content: '汪汪币不足',
        showCancel: false
      })
    }else{
      try {
        wx.showLoading()
      }
      catch (err) {
        console.log("当前微信版本不支持")
      }
      wx.request({
        url: api + "Goods/addOrder",
        method: 'POST',
        header: header,
        data: { session_3rd: wx.getStorageSync('token'), goods_id: self.data.goodsId, address_id: self.data.isDefaultAdd.address_id,amount:self.data.num },
        success: function (res) {
          try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
          if (res.data.code == 200) {
            wx.showModal({
              title: '提示',
              content: '兑换成功',
              showCancel: false,
              success:function(){
                wx.navigateTo({
                  url: '../myCoin/myCoin'
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