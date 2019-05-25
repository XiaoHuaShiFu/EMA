// pages/my/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        name: '吴嘉贤',
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/LS8r1tq6MiaPbEPRagpGiaQibf9Yogkfe6kplyiaIyAQrEYk7gU5a6gCPtFtPxlZHIL0OZWIyZG2d1XeriamLWK58pw/132'
      },
      {
        name: '王碧云',
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/T32zwUvtqibPCUA8N12SaURPBD2k4twvicKiazKgxXcttUmkGAsTdeA7hTZ0bfbzjUoWUOIoDfGdwibSswlv9xqABg/132'
      },
      {
        name: '郑颖娴',
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/djO9rmYljItrmUHyzLgLRUfY7ic6ghftyaAD1TBzKqtRckI8I5woz0HosC4JDatu5AH8Ria3vuicMV0UOntptiaJRA/132'
      },
      {
        name: '张悦莹',
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/y9LwBHN16zoMNFcyf6Eib4WRlg8ziaoEUagn1sFk1CaQxsc71MqBxhzc6WU6aYic7dAdbAbpRcAHDJjlmGn9FR12Q/132'
      }
    ]
  },

  copyLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: res => {
        wx.showToast({
          title: '已复制',
          duration: 1000,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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