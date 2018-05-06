var app = getApp();
var header = app.globalData.header;
var api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      members: [],
      indexs: 0,
      page: 1,
      number: 20,
      list: [],
      showMember: "",
      n:0,
      cityListId:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if(options.index){
      this.setData({
        indexs: parseInt(options.index)
      })
    }
    console.log(this.data.indexs)
    this.checkToken()

  },
  setClass() {
    for (let i = 0; i < this.data.members.length; i++) {
      let obj = this.data.members[i];
      if (this.data.indexs - i == 3) {
        obj.class = "itemleft1"
      } else if (this.data.indexs - i == 2) {
        obj.class = "itemleft2"
      } else if (this.data.indexs - i == 1) {
        obj.class = "itemleft3"
      } else if (this.data.indexs - i == 0) {
        obj.class = "itemcenter"
      } else if (this.data.indexs - i == -1) {
        obj.class = "itemright3"
      } else if (this.data.indexs - i == -2) {
        obj.class = "itemright2"
      } else if (this.data.indexs - i == -3) {
        obj.class = "itemright1"
      } else {
        obj.class = ""
      }

    }
    this.setData({ members: this.data.members })
    this.setData({
      cityListId: ""
    })
    this.getList(this.data.members[parseInt(this.data.indexs)].id);
  },
  touchstart(evt) {
    this.data.startX = evt.touches[0].clientX;
  },
  touchmove(evt) {
    if (this.data.startX > 0) {
      if (evt.touches[0].clientX > this.data.startX) {
        if (this.data.indexs > 0) {
          this.data.indexs--;
          this.setClass();
   
        }

      } else if (evt.touches[0].clientX < this.data.startX) {
        if (this.data.indexs < this.data.members.length - 2) {
          this.data.indexs++;
          this.setClass();
   
        }

      }
      this.data.startX = -1


    }
  },
  checkToken: function () {
    if (wx.getStorageSync('token')) {
      this.getMembers();
      


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
  // 切换家属
  changeJs: function (e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      indexs: index
    })
    self.setClass();

  },
  getList: function (id) {
    var self = this;
    try {
      wx.showLoading({
        title: '加载中',
      })
    } catch (err) {
      console.log("当前微信版本不支持")
    }
    wx.request({
      url: api + 'Coreout/remindYm', //仅为示例，并非真实的接口地址
      data: {
        number: self.data.number,
        page: self.data.page,
        session_3rd: wx.getStorageSync('token'),
        m_id:id
      },
      method: 'GET',
      success: function (res) {
        try { wx.hideLoading() } catch (err) { console.log("当前微信版本不支持") }
        if (res.data.code == 200) {
          if (res.data.data.info.length) {
            
            self.setData({
              page: self.data.page + 1,
              list: res.data.data.info,
              n: res.data.data.distance
              
            })

            for (var i = 0; i < res.data.data.info.length; i++) {
              var list = []
              if (self.data.cityListId == "") {
                for (var j = 0; j < res.data.data.info[i].info.length; j++) {
                  if (res.data.data.info[i].info[j].is_show == 1) {
                    self.setData({
                      cityListId: "n" + i
                    });
                    break;
                  }
                }

              } else {
                break
              }


            }
            console.log(self.data.cityListId)
      
          } else {
            wx.showToast({
              title: '没有了！',
              icon: 'fail',
              duration: 2000
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

        }  else {
          wx.showToast({
            title: "报错了",
            icon: 'fail',
            duration: 2000
          })
        }
      }
    })
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
    // this.getList(this.data.showMember.id)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gotoAddV:function(e){
    var self=this;
    var id=e.currentTarget.dataset.id;
    var done = e.currentTarget.dataset.done;
    var yid = e.currentTarget.dataset.yid;
    console.log(id);
    wx.redirectTo({
      url: '../addVaccine/addVaccine?id=' + id + '&mid=' + self.data.members[self.data.indexs].id + '&index=' + self.data.indexs+'&done='+done+'&yid='+yid
    })

  },
  gotoAdd: function () {
    wx.redirectTo({
      url: '../addMembers/addMembers?path=vaccineRecord'
    })
  }
})