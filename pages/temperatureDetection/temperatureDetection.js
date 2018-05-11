var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
var wxCharts = require('../../utils/wxcharts.js');
var lineChart = null;
var startPos = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "members": [],
    "index": 0,
    "temNum":35,
    "isCan":false,
    "arr":[],
    "temArr":[],
    "isCanvas":false,
    "curDate":"2018-04-29",
    "curTime":"00:00",
    "endDate": "",
    "dateStart": "",
    "dateEnd": "",
    "timeStart":"",
    "timeEnd":""

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
    this.getTW(this.data.members[this.data.index].id)
    this.setData({
      temNum: 35,
      "isCan": false,
      "arr": [],
      "temArr": []

    })
  },
  touchstart(evt) {
    this.data.startX = evt.touches[0].clientX;
  },
  minTem:function(){
    if (this.data.temNum>35){
      var cur = (this.data.temNum * 10 - 1) / 10;
      this.setData({
        temNum: cur,
        isCan: true
      })
    }
    

  },
  addTem:function(){
    if (this.data.temNum <42){
      var cur = (this.data.temNum * 10 + 1) / 10;
      this.setData({
        temNum: cur,
        isCan: true
      })
    }
    

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
  changeJs: function (e) {
    var self = this;
    console.log(e)
    var index=e.currentTarget.dataset.index;
    this.setData({
      index:index
    })
    this.setClass();
    


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
  submitRange:function(){
    this.getTW(this.data.members[this.data.index].id)

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
  // 查询体温
  getTW: function (id) {
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "CoreOut/getTw",
      method: 'GET',
      header: header,
      data: { 
        session_3rd: wx.getStorageSync('token'),
        m_id:id,
        mni_time:_this.data.dateStart+" "+_this.data.timeStart,
        max_time: _this.data.dateEnd + " " + _this.data.timeEnd

         },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          var arr=[];
          var temArr=[];
          if (res.data.data.length>0){
            for (var i = 0; i < res.data.data.length; i++) {
              arr.push(res.data.data[i].do_time);
              temArr.push(parseFloat(res.data.data[i].temperature));
            }
            _this.setData({
              arr: arr.reverse(),
              temArr: temArr.reverse(),
              isCanvas:false
            })
            _this.drawLine()
            

          }
          else {
            _this.setData({
              isCanvas:true
            })

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
  changeTem:function(e){
    this.setData({
      temNum:parseInt(e.detail.value)/10,
      isCan:true
    })

  },
  
  lastDate: function (now) {
    var year = now.getFullYear();
    var month = now.getMonth() > 10 ? now.getMonth() : "0" + now.getMonth();
    var date = now.getDate();
    var hour = now.getHours() > 10 ? now.getHours() : "0" + now.getHours(); 
    var minute = now.getMinutes() > 10 ? now.getMinutes() : "0" + now.getMinutes();
    var second = now.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute; 
  },
  formatDate:function (now) { 
    var year= now.getFullYear(); 
    var month = (now.getMonth() + 1) > 10 ? now.getMonth()+1 : "0" + (now.getMonth()+1); 
    var date= now.getDate(); 
    var hour = now.getHours() > 10 ? now.getHours() : "0" + now.getHours(); 
    var minute = now.getMinutes() > 10 ? now.getMinutes() : "0" + now.getMinutes();
    var second= now.getSeconds(); 
    return year+ "-" + month + "-" + date + " " + hour + ":" + minute; 
  },
  changeWTDate:function(e){
    this.setData({
      curDate: e.detail.value
    })

  },
  changeDateStart:function(e){
    this.setData({
      dateStart: e.detail.value
    })


  },
  changeDateEnd:function(e){
    this.setData({
      dateEnd: e.detail.value
    })

  },
  changeWTTime: function (e) {
    this.setData({
      curTime: e.detail.value
    })

  },
  submit:function(){
    var _this = this;
    try {
      wx.showLoading()
    }
    catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + "CoreIn/addTw",
      method: 'POST',
      header: header,
      data: { 
        session_3rd: wx.getStorageSync('token'), 
        m_id: _this.data.members[_this.data.index].id, 
        do_time:_this.data.curDate+" "+this.data.curTime, 
        temperature: _this.data.temNum 
        },
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {

          _this.setData({
            isCan: false,
            arr: _this.data.arr.concat(_this.formatDate(new Date())),
            temArr: _this.data.temArr.concat(_this.data.temNum),
            isCanvas:false,
            curDate: (_this.formatDate(new Date()).split(" "))[0],
            curTime: (_this.formatDate(new Date()).split(" "))[1],
          })
          _this.drawLine()

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
        // return category
        return category +  ',' + item.data
      }
    });
  },
  drawLine:function(){
    var self=this;
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
        name: '体温',
        data: self.data.temArr,
        format: function (val, name) {
          return val + '℃';
        }
      }],
      xAxis: {
        disableGrid: false,
        title: '日期',
        format: function (val) {
          return "";
        }
      },
      yAxis: {
        title: '体温 (℃)',
        format: function (val) {
          return val;
        },
        min: 35
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      endDate: this.formatDate(new Date()),
      curDate: (this.formatDate(new Date()).split(" "))[0],
      curTime: (this.formatDate(new Date()).split(" "))[1],
      dateEnd: (this.formatDate(new Date()).split(" "))[0],
      dateStart:(this.lastDate(new Date()).split(" "))[0],
      timeEnd: (this.formatDate(new Date()).split(" "))[1],
      timeStart: (this.lastDate(new Date()).split(" "))[1],
      
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
  gotoAdd: function () {
    wx.redirectTo({
      url: '../addMembers/addMembers?path=temperatureDetection'
    })
  }
})