const app = getApp();
const api = require('../../../../utils/API.js');
const responseCode = require('../../../../common/ResponseCode.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    length: 50,
    disable: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },


  changeStatus: function (e) {
    let length = e.detail.value.length;
    this.setData({
      email: e.detail.value,
      length: 50 - length
    });
    if (length > 0 && this.checkEmail()) {
      this.setData({
        disable: false,
      });
    }
    else {
      this.setData({
        disable: true,
      });
    }
  },

  checkEmail: function () {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    var str = this.data.email;
    if(!reg.test(str)) {
      return false;
    }
    else {
      return true;
    }
  },

  editEmail: function () {
    console.log(this.data.email);
    let user = app.globalData.user;
    console.log(user);
    user.email = this.data.email;
    console.log(app.globalData.user);
    api.request({
      url: '/user/update_information.do',
      method: "POST",
      data: {
        email: user.email
      }
    }).then(respond => {
      console.log(respond);
      if (respond.data.status == responseCode.SUCCESS) {
        wx.showToast({
          title: '邮箱修改成功',
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
          title: '邮箱修改失败',
          image: '/image/fail.png',
          duration: 1000
        });
      }
    });
  }
})