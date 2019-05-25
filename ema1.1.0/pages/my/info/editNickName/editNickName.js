const app = getApp();
const api = require('../../../../utils/API.js');
const responseCode = require('../../../../common/ResponseCode.js');
const show = require('../../../../utils/Show.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    length: 30,
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
    if(length > 0) {
      this.setData({
        disable: false,
        nickName: e.detail.value
      })
    }
    else {
      this.setData({
        disable: true,
      })
    }
    this.setData({
      length: 30-length
    })
  },
  
  editNickName: function () {
    api.request({
      url: '/user/update_information.do',
      method: "POST",
      data: {
        nickName: app.globalData.user.nickName
      }
    }).then(respond => {
      console.log(respond);
      if(respond.data.status == responseCode.SUCCESS) {
        app.globalData.user.nickName = this.data.nickName;
        show.showToast('昵称修改成功', 'success');
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          });
        }, 1000);
      }
      else {
        show.showToast('失败', 'fail');
      }
    });

  }
})