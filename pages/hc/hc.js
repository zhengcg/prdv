var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: '',
    "isCanvas": true,
    "arr": [],
    "temArr": [],
    "mid":"",
    "title":"",
    "range":"",
    mni_time: '',
    max_time: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mid: options.mid,
      title:options.title,
      mni_time: options.mni_time,
      max_time: options.max_time
    })

    this.checkToken()

  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getList()
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
  previewImg: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })

  },
  getList: function () {
    var _this = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/getHyDetail', //仅为示例，并非真实的接口地址
      data: {
        session_3rd: wx.getStorageSync('token'),
        m_id: parseInt(_this.data.mid),
        title_cn:_this.data.title,
        mni_time: _this.data.mni_time,
        max_time: _this.data.max_time
      },
      method: 'POST',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          var arr = [];
          var temArr = [];
          if (res.data.data.length > 0) {

            for (var i = 0; i < res.data.data.length; i++) {
              arr.push(res.data.data[i].do_time);
              temArr.push(parseFloat(res.data.data[i].result));
            }
            _this.setData({
              arr: arr,
              temArr: temArr,
              isCanvas: false,
              range: res.data.data[0].range
            })
            _this.drawLine()


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

        } else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
  },
  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {

        return category + ' ' + "指标" + ':' + item.data
      }
    });
  },
  drawLine: function () {
    var self = this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: self.data.arr,
      animation: true,
      series: [{
        name: '日期',
        data: self.data.temArr,
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: false
      },
      yAxis: {
        title: '指标',
        format: function (val) {
          return val;
        },
        min: 33
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      // enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });

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
    this.getList()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})