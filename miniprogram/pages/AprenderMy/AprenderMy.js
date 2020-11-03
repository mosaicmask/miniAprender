// pages/AprenderMy/AprenderMy.js
const App = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_flag: false,
    userInfo: '',
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getOpenid()
  },

  setuserinfo: function (e) {
    let that = this
    let userinfo = e.detail.userInfo
    // 向集合中插入数据
    db.collection('userInfo').add({
      data: {
        nickName: userinfo.nickName,
        avatarUrl: userinfo.avatarUrl,
        country: userinfo.country,
        likeTutorials: '',
        likeBooks: '',
      }
    }).then(res => {
      // console.log(res)
      // 成功之后修改页面数据
      that.setData({
        login_flag: true,
        userInfo: userinfo
      })
      App.userInfo = userinfo
    })
  },

  // 定义调用云函数获取openid
  getOpenid() {
    let this_ = this
    // 获取openid
    wx.cloud.callFunction({
      // 云函数名称
      name: 'login',
      data: {},
    }).then(res => {
      // 获取到openid之后根据openid获取记录的数据
      db.collection('userInfo').where({
          _openid: res.result.openid
        })
        .get()
        .then(res => {
          // 如果存在
          // 这里因为返回的是一个数组，所以通过数组长度来判断集合里是否有对应的值
          if (res.data.length != 0) {
            this_.setData({
              login_flag: true,
              userInfo: res.data[0]
            })
            App.userInfo = res.data[0]
          } else {
            // 如果不存在
            this_.setData({
              login_flag: false
            })
          }
          // 停止加载提示
          wx.hideLoading()
        })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})