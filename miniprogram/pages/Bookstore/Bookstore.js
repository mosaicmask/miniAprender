// 引入SDK核心类
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例化API核心类
const qqmapsdk = new QQMapWX({
  key: 'XAYBZ-ZWZW3-ENP3D-3UKRR-4UE65-ASBKJ'
});
Page({
  data: {
    userLatitude: null,
    userLongitude: null,
    markers: [],
    details: [],
    distance: '',
    show: false,
    current: null
  },
  onLoad: function () {
    this.getUserLocation()
  },
  onShow: function () {
    // 获取周围书店
    this.getNearbyBookstore()
  },

  // 获取用户位置
  getUserLocation: function () {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.setData({
          userLatitude: res.latitude,
          userLongitude: res.longitude
        })
      }
    })
  },

  // 获取周围书店
  getNearbyBookstore: function () {
    let that = this
    // 调用接口
    qqmapsdk.search({
      keyword: '书城',
      success: function (res) {
        // console.log(res.data);
        let arr = []
        for (let i in res.data) {
          let obj = {}
          obj.id = res.data[i].id
          obj.latitude = res.data[i].location.lat
          obj.longitude = res.data[i].location.lng
          obj.title = res.data[i].address
          obj.callout = {
            content: res.data[i].title,
            padding: 10,
            display: 'BYCLICK',
            textAlign: 'center',
            anchorY: 30,
            fontSize: 10,
            bgColor: '#ffffff00'
          }
          // console.log(obj);
          arr.push(obj)
        }
        // console.log(arr);
        that.setData({
          markers: arr,
          details: res.data
        })
      },
    });
  },

  // 地图标记点击事件
  markertap(e) {
    // console.log(e.detail.markerId)
    // 弹出层事件
    this.showPopup()
    for (let i in this.data.details) {
      // 判断id是否相等
      if (e.detail.markerId == this.data.details[i].id) {
        // 调用地址处理方法
        this.dealwith(this.data.details[i])
        // 调用计算距离方法
        this.calculationDistance(this, this.data.markers[i])
      }
    }
  },

  // 地址处理
  dealwith: function (e) {
    // 接收传过来的值
    let newaddress = e.address
    // 进行数据处理 slice提取字符串的片断:
    newaddress = newaddress.slice(newaddress.indexOf('市') + 1, newaddress.indexOf('号') + 1)
    // 将处理好的值赋值回去
    e.address = newaddress
    this.setData({
      current: e,
    })
  },

  // 计算距离
  calculationDistance: (_this, markers) => {
    var _this = _this;
    // 定义一个空数组  因为to值只接受数组
    let newmarkers = [];
    // 将我们当前需要计算距离的坐标信息push进去
    newmarkers.push(markers)
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
      to: newmarkers, //终点坐标
      success: function (res) { //成功后的回调
        var res = res.result;
        var dis = [];
        // 转换为公里
        let hw = res.elements[0].distance
        hw = (hw / 2 / 500).toFixed(2) + '公里'
        // 赋值
        _this.setData({
          distance: hw
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },

  // 弹出层事件
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
})