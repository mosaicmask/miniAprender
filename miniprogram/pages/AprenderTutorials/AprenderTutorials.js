// pages/AprenderTutorials/AprenderTutorials.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    file: [],
    tutorial: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTutorialsList()
  },

  // 控制模态框显示
  showPopup(e) {
    // console.log(e.currentTarget.dataset.tutorialsid);
    let that = this
    let tutorialsid = e.currentTarget.dataset.tutorialsid
    // 根据教程id在数据库中查询对应信息
    db.collection('Doctutorial').where({
        tutorialsId: tutorialsid,
      })
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          // console.log(res.data)
          that.setData({
            show: true,
            tutorial: res.data[0]
          });
        }
      })
  },

  // 控制模态框隐藏
  onClose() {
    this.setData({
      show: false
    });
  },

  // 跳转教程列表
  goIntroduction: function (e) {
    // console.log(e.currentTarget.dataset.tutorialsid);
    wx.navigateTo({
      url: '/pages/TutorialPage/TutorialPage?tutorialsid=' + e.currentTarget.dataset.tutorialsid
    })
  },

  // 获取教程列表
  getTutorialsList: function () {
    let that = this
    // 根据type在数据库中查询对应信息
    db.collection('Doctutorial').where({
        type_C: 'yes',
      })
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          // console.log(res.data)
          that.setData({
            file: res.data
          })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})