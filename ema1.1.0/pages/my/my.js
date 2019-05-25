const app = getApp();
const api = require('../../utils/API.js');
const responseCode = require('../../common/ResponseCode.js');

Page({
  data: {
    user: app.globalData.user,
    list: [
      {
        text: '我的发布',
        icon: 'post',
        // url: 'report/report'
        url: 'postList/postList?value=0'
      },
      {
        text: '我的关注',
        icon: 'favor',
        // url: 'supervision/supervision'
        url: 'postList/postList?value=1'
        // url: 'collect/collect'
      },
      {
        text: '我的评论',
        icon: 'comment',
        url: 'comment/comment'
      },
      {
        text: '最近浏览',
        icon: 'time',
        // url: 'view/view'
        url: 'postList/postList?value=2'
      },
      {
        text: '我的消息',
        icon: 'message',
        url: 'message/message'
      },
      {
        text: '关于我们',
        icon: 'info',
        url: 'about/about'
      }],
  },
    
  onShow: function () {
    this.setData({
      user: app.globalData.user
    });
  },

  navigateTo (e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
  },

  navigateToInfo: function () {
    wx.navigateTo({
      url: 'info/info',
    })
  }
})
