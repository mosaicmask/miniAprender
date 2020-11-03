// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.js');
var wxMarkerData = [];
Page({

  data: {
    city: '',
    district: '',
    realtime: '',
    weather: 'lightRain',
    AdvertisingSpace: [
      'https://s1.ax1x.com/2020/08/09/a7RVJ0.jpg',
      'https://s1.ax1x.com/2020/08/09/a7RVJ0.jpg',
      'https://s1.ax1x.com/2020/08/09/a7RVJ0.jpg'
    ]
  },
  /**
   * 页面相关事件处理函数--监听页面加载
   */
  onLoad: function () {
    this.getUserPosition()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getUserPosition()
    wx.stopPullDownRefresh()
  },

  // 跳转文档页面
  goDocumentation: function () {
    wx.switchTab({
      url: '/pages/AprenderIndex/AprenderIndex'
    })
  },

  // 跳转教程页面
  goTutorials: function () {
    wx.switchTab({
      url: '/pages/AprenderTutorials/AprenderTutorials'
    })
  },

  // 跳转书籍页面
  goBookCity: function () {
    wx.switchTab({
      url: '/pages/AprenderBooks/AprenderBooks'
    })
  },

  // 获取用户位置
  getUserPosition: function () {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: '5SzV0OoGYBadgtTGNRuTNkYIrKHoiTYN'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      // console.log(data.originalData.result.addressComponent);
      wxMarkerData = data.wxMarkerData;
      that.setData({
        city: data.originalData.result.addressComponent.city,
        district: data.originalData.result.addressComponent.district
      });
      that.getUserWeather(that);
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
    });
  },

  // 获取用户所在地天气
  getUserWeather: function (that) {
    let City = this.data.city
    var newCity = City.slice(0, City.length - 1);
    wx.request({
      url: 'http://apis.juhe.cn/simpleWeather/query?city=' + newCity + '&key=50fac810afb59ccaa635a1ed84659d1d', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'json' // 默认值
      },
      success(res) {
        // console.log(res.data.result.realtime)
        that.setData({
          realtime: res.data.result.realtime
        })
        that.userWeather(res.data.result.realtime.info, that)
      }
    })
  },

  // 判断用户天气
  userWeather: (res, that) => {
    console.log('res :>> ', res);
    switch (res) {
      case '多云':
        that.clog('cloudy', that)
        break;
      case '阴':
        that.clog('overcast', that)
        break;
      case '晴':
        that.clog('clear', that)
        break;
      case '小雨':
        that.clog('lightRain', that)
        break;
      case '中雨':
        that.clog('moderateRain', that)
        break;
    }
  },

  // 更改天气状态图标
  clog: (res, that) => {
    that.setData({
      weather: res
    })
  }
})