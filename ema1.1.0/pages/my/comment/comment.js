const app = getApp();
const api = require('../../../utils/API.js');
const responseCode = require('../../../common/ResponseCode.js');
const show = require('../../../utils/Show.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    comments: [],
    maxPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getNextPage();
  },

  getNextPage: function() {
    api.request({
      url: '/incident_comment/user_list.do',
      method: "POST",
      data: {
        pageNum: this.data.maxPage,
        pageSize: 7
      }
    }).then(respond => {
      let result = respond.data.data;
      console.log(result);
      if (result.size > 0) {
        let commentsList = result.list;
        let comments = this.data.comments;
        for (var key in commentsList) {
          comments.push(commentsList[key]);
        }
        this.setData({
          comments: comments,
          maxPage: this.data.maxPage + 1
        })
        console.log(comments)
      } else {

      }

    });
  },

  /**
   * 删除评论
   */
  deleteComment: function (e) {
    let that = this;
    console.log(e.currentTarget.id);
    api.request({
      url: '/incident_comment/delete.do',
      method: 'POST',
      data: {
        id: that.data.commentInfo.id,
        incidentId: that.data.commentInfo.incidentId,
      }
    }).then(respond => {
      console.log(respond);
      let response = respond.data;
      if (response.status == responseCode.SUCCESS) {
        show.showToast('删除成功', 'success');
        var comments = that.data.comments;
        var index = e.currentTarget.dataset.index;
        comments[index].deleted = true;
        that.setData({
          comments: comments
        });
      } else {
        show.showToast('失败', 'fail');
      }
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      user: app.globalData.user
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getNextPage();
  }

})