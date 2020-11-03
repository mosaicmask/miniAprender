// pages/AprenderBooks/AprenderBooks.js
const db = wx.cloud.database();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: 0,
    show: false,
    bookMenu: [
      "HTML/CSS",
      "JavaScript",
      "Vue.js",
      "jQuery",
      "React",
      "Node.js",
      "Python",
      "JAVA",
      "Mysql",
      "PHP",
      "微信小程序",
      "更多书籍更新中...",
    ],
    books: [],
    likeBooks: [],
    bookNum: 0,
    bookPrice: 0
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '获取数据中',
    })
    this.getbooks('HTML/CSS')
    console.log(this.data.likeBooks);
  },

  // 侧边导航点击事件
  chage: function (e) {
    let type = e.currentTarget.dataset.type
    wx.showLoading({
      title: '获取数据中',
    })
    this.getbooks(type)
  },

  // 加入想买
  like: function (e) {
    // 循环从数据库获取到的书籍数组
    for (let i in this.data.books) {
      // 判断数组中是否有与当前点击传过来的id一样的数据
      if (this.data.books[i].bookID == e.currentTarget.dataset.bookId) {
        // 循环自定义加购书籍数组
        for (let j in this.data.likeBooks) {
          // 判断加购的书籍数组中是否有当前点击传过来的id一样的数据
          if (this.data.likeBooks[j].bookID == e.currentTarget.dataset.bookId) {
            // 如果有的话直接更改数组里的值
            let newPrice = this.data.likeBooks[j].bookPrice
            newPrice = newPrice.replace('.', '')
            this.setData({
              // 微信小程序数组里的值修改，for循环修改数组内容 [对象.值]
              ['likeBooks[' + j + '].commodityNum']: this.data.likeBooks[j].commodityNum + 1,
              bookPrice: this.data.bookPrice + +newPrice,
              bookNum: this.data.bookNum + 1
            })
            // 结束
            return
          }
        }
        // 如若加购的书籍数组中没有当前点击传过来的id一样的数据，就往数组中push新数据
        let likeBooks = this.data.likeBooks
        let newPrice = this.data.books[i].bookPrice
        // replace()方法用另一个值替换在字符串中指定的值
        newPrice = newPrice.replace('.', '')
        // 往对象里添加新属性
        this.data.books[i]['commodityNum'] = 1
        likeBooks.push(this.data.books[i])
        // console.log(likeBooks);
        this.setData({
          likeBooks: likeBooks,
          bookPrice: this.data.bookPrice + +newPrice,
          bookNum: this.data.bookNum + 1
        })
      }
    }
  },
  // 获取图书信息
  getbooks: function (e) {
    let that = this
    db.collection('books').where({
        bookClassification: e,
      })
      .get()
      .then(res => {
        // console.log(res.data)
        that.setData({
          books: res.data
        })
        // 停止加载提示
        wx.hideLoading()
      })
  },

  // 查看书店
  goBookstore: function () {
    wx.navigateTo({
      url: '/pages/Bookstore/Bookstore',
    })
  },

  // 查看已加购商品
  lookProductList: function () {
    this.setData({
      show: true
    });
  },

  // 增加加购商品数量
  CommodityNumPlus: function (e) {
    // 循环likeBooks数组
    for (let i in this.data.likeBooks) {
      // 如果数组内id与点击传过来的id相等
      if (this.data.likeBooks[i].bookID == e.currentTarget.dataset.bookid) {
        let newPrice = this.data.likeBooks[i].bookPrice
        // 处理字符串
        newPrice = newPrice.replace('.', '')
        // 赋值
        this.setData({
          // 微信小程序数组里的值修改，for循环修改数组内容 [对象.值]
          ['likeBooks[' + i + '].commodityNum']: this.data.likeBooks[i].commodityNum + 1,
          bookPrice: this.data.bookPrice + +newPrice,
          bookNum: this.data.bookNum + 1
        })
      }
    }
  },

  //减少加购商品数量 
  CommodityNumMinus: function (e) {
    for (let i in this.data.likeBooks) {
      if (this.data.likeBooks[i].bookID == e.currentTarget.dataset.bookid) {
        let newPrice = this.data.likeBooks[i].bookPrice
        newPrice = newPrice.replace('.', '')
        this.setData({
          // 微信小程序数组里的值修改，for循环修改数组内容 [对象.值]
          ['likeBooks[' + i + '].commodityNum']: this.data.likeBooks[i].commodityNum - 1,
          bookPrice: this.data.bookPrice - +newPrice,
          bookNum: this.data.bookNum - 1
        })
      }
    }
  },

  // 点击加入收藏按钮
  onClickButton: function () {
    let likeBooks = this.data.likeBooks
    let that = this
    // 判断用户是否登录
    if (app.userInfo._id == undefined) {
      wx.showModal({
          title: '提示',
          content: '收藏书籍需要登录，是否前往授权？',
        })
        .then(res => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/AprenderMy/AprenderMy'
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        })
    } else {
      // 判断用户是否选择书籍
      if (likeBooks.length == 0) {
        wx.showToast({
          title: '请先选择书籍',
          icon: 'none',
          duration: 2000
        })
      } else {
        db.collection('userInfo').doc(app.userInfo._id).update({
            // data 传入需要局部更新的数据
            data: {
              likeBooks: likeBooks
            },
          })
          .then(res => {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              likeBooks: [],
              bookNum: 0,
              bookPrice: 0
            })
          })
      }
    }
  },

  // 清空
  removeLike: function () {
    wx.showLoading({
      title: '清除中',
    })
    this.setData({
      likeBooks: [],
      bookNum: 0,
      bookPrice: 0
    })
    // 停止加载提示
    wx.hideLoading()
  },

  // 弹出层隐藏
  onClose() {
    this.setData({
      show: false
    });
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