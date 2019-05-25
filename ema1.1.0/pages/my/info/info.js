const app = getApp();
const api = require('../../../utils/API.js');
const responseCode = require('../../../common/ResponseCode.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    userInfoList: [],
    genderPicker: ['man', 'woman'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let user = app.globalData.user;
    this.setData({
      user: app.globalData.user,
      userInfoList: [{
          text: '昵称',
          type: 'NickName',
          info: user.nickName
        },
        {
          text: '电话',
          type: 'Phone',
          info: user.phone
        },
        {
          text: '邮箱',
          type: 'Email',
          info: user.email
        }

      ],
    });
  },

  /**
   * 修改头像
   */
  editAvatar: function() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          avatarUrl: res.tempFilePaths[0]
        });
        console.log(that.data.avatarUrl);
        let user = app.globalData.user;
        console.log(user);
        user.avatarUrl = that.data.avatarUrl;
        console.log(app.globalData.user);
        api.request({
          url: '/user/update_avatar.do',
          method: "POST",
          data: {
            avatar: that.data.avatarUrl,
          }
        }).then(respond => {
          console.log(respond);
        });
      },
    });
  },

  /**
   * 修改性别
   */
  editGender: function(e) {
    console.log(this.data.genderPicker[e.detail.value]);
    var value = parseInt(e.detail.value)+1;
    value = value.toString();
    console.log(value);
    let user = app.globalData.user;
    user.gender = this.data.genderPicker[e.detail.value];
    console.log(user);
    api.request({
      url: '/user/update_information.do',
      method: "POST",
      data: {
        gender: value
      }
    }).then(respond => {
      console.log(respond.data);
      if (respond.data.status == responseCode.SUCCESS) {
        this.setData({
          user: user
        });
        wx.showToast({
          title: '性别修改成功',
          imag: '/image/success.png',
          duration: 1000
        });
      }
      else {
        wx.showToast({
          title: '性别修改失败',
          image: '/image/fail.png',
          mask: true,
          duration: 1000
        });
      }
    });
  },

  onShow: function (options) {
    this.setData({
      'userInfoList[0].info': app.globalData.user.nickName,
      'userInfoList[1].info': app.globalData.user.phone,
      'userInfoList[2].info': app.globalData.user.email
    });
  }
});