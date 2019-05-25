const app = getApp();
const api = require('../../../../utils/API.js');
const responseCode = require('../../../../common/ResponseCode.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    length: 11,
    disable: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = app.globalData.user;
  },

  changeStatus: function (e) {
    let length = e.detail.value.length;
    if (length != 11) {
      this.setData({
        disable: true
      })
    }
    else {
      this.setData({
        disable: false
      })
    }
    this.setData({
      length: 11 - length,
      phone: e.detail.value
    })
  },

  editPhone: function () {
    console.log(this.data.phone);
    let user = app.globalData.user;
    console.log(user);
    user.phone = this.data.phone;
    console.log(app.globalData.user);
    api.request({
      url: '/user/update_information.do',
      method: "POST",
      data: {
        phone: user.phone
      }
    }).then(respond => {
      console.log(respond);
      if (respond.data.status == responseCode.SUCCESS) {
        wx.showToast({
          title: '电话修改成功',
          image: '/image/success.png',
          duration: 1000
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          });
        }, 1000);
      }
      else {
        wx.showToast({
          title: '电话修改失败',
          image: '/image/fail.png',
          duration: 1000
        });
      }
    });
  }
})