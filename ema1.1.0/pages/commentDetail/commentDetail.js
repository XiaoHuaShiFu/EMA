const app = getApp();
const api = require('../../utils/API.js');
const responseCode = require('../../common/ResponseCode.js');
const show = require('../../utils/Show.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputBottom: 0,
    inputDisplay: 0,
    incidentId: 0,
    user: null,
    commentIndex: 0,
    commentInfo: '',
    comment: '',
    scndComments: [],
    maxPage: 1,
    scndCommentId: 0,
    scndCommentIndex: 0,
    anon: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.id > 0) {
      api.request({
        url: '/incident_comment/get_comment.do',
        method: "POST",
        data: {
          id: options.id,
        }
      }).then(respond => {
        console.log(respond);
        let response = respond.data;
        if (response.status == responseCode.SUCCESS) {
          this.setData({
            incidentId: options.value,
            commentIndex: options.index,
            commentInfo: respond.data.data,
            user: app.globalData.user
          });
          this.getNextPage();
        } else {
          show.showToast('失败', 'fail');
        }
      });
    } else {}
  },

  /**
   * 获取下一页
   */
  getNextPage: function() {
    let that = this;
    api.request({
      url: '/incident_scnd_comment/list.do',
      method: "POST",
      data: {
        incidentCommentId: that.data.commentInfo.id,
        pageNum: that.data.maxPage,
        pageSize: 7
      }
    }).then(respond => {
      let response = respond.data;
      console.log("response=");
      console.log(response);
      if (response.data.size > 0) {
        let scndCommentList = response.data.list;
        let scndComments = that.data.scndComments;
        for (var key in scndCommentList) {
          scndComments.push(scndCommentList[key]);
        }
        that.setData({
          scndComments: scndComments,
          maxPage: that.data.maxPage + 1
        });
        console.log("scndComments=");
        console.log(scndComments);
      } else {}

    });
  },

  /**
   * 删除一级评论
   */
  deleteComment: function() {
    let that = this;
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
      console.log(respond);
      if (response.status == responseCode.SUCCESS) {
        var index = that.data.commentIndex;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var comment = prevPage.data.postInfo.incidentCommentVoList;
        console.log(comment[index]);
        console.log(index);
        comment[index].deleted = true;
        prevPage.setData({
          'postInfo.incidentCommentVoList': comment,
          'postInfo.comments': prevPage.data.postInfo.comments - 1
        });
        show.showToast('删除成功', 'success');
        setTimeout(function() {
          wx.navigateBack({
            delta: 1,
          });
        }, 1000);
      } else {
        show.showToast('失败', 'fail');
      }

    });
  },

  /**
   * 点赞一级评论
   */
  thumbUpComment: function() {
    let that = this;
    api.request({
      url: '/incident_comment/thumb_up.do',
      method: 'POST',
      data: {
        id: that.data.commentInfo.id
      }
    }).then(respond => {
      let response = respond.data;
      console.log(respond);
      var index = that.data.commentIndex;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var comment = prevPage.data.postInfo.incidentCommentVoList;
      if (response.status == responseCode.THUMB_UP_SUCCESS) {
        comment[index].thumbUps = comment[index].thumbUps + 1;
        comment[index].thumbUp = true;
        prevPage.setData({
          'postInfo.incidentCommentVoList': comment
        });
        that.setData({
          'commentInfo.thumbUps': that.data.commentInfo.thumbUps + 1,
          'commentInfo.thumbUp': true,
        });
        show.showToast('点赞成功', 'success');
      } else if (response.status == responseCode.CANCEL_THUMB_UP_SUCCESS) {
        comment[index].thumbUps = comment[index].thumbUps - 1;
        comment[index].thumbUp = false;
        prevPage.setData({
          'postInfo.incidentCommentVoList': comment
        });
        that.setData({
          'commentInfo.thumbUps': that.data.commentInfo.thumbUps - 1,
          'commentInfo.thumbUp': false,
        });
        show.showToast('取消点赞成功', 'success');
      } else {
        show.showToast('失败', 'fail');
      }
    })
  },

  /**
   * 关注一级评论
   */
  collectComment: function(e) {
    let that = this;
    api.request({
      url: '/incident_comment//collect.do',
      method: 'POST',
      data: {
        id: that.data.commentInfo.id,
      }
    }).then(respond => {
      let response = respond.data;
      console.log(respond);
      var index = that.data.commentIndex;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var comment = prevPage.data.postInfo.incidentCommentVoList;
      if (response.status == responseCode.COLLECTION_SUCCESS) {
        comment[index].collections = comment[index].collections + 1;
        comment[index].collection = true;
        prevPage.setData({
          'postInfo.incidentCommentVoList': comment
        });
        that.setData({
          'commentInfo.collections': that.data.commentInfo.collections + 1,
          'commentInfo.collection': true,
        });
        show.showToast('收藏成功', 'success');
      } else if (response.status == responseCode.CANCEL_COLLECTION_SUCCESS) {
        comment[index].collections = comment[index].collections - 1;
        comment[index].collection = false;
        prevPage.setData({
          'postInfo.incidentCommentVoList': comment
        });
        that.setData({
            'commentInfo.collections': that.data.commentInfo.collections - 1,
            'commentInfo.collection': false,
          }),
          show.showToast('取消收藏成功', 'success');
      } else {
        show.showToast('失败', 'fail');
      }
    });
  },

  /**
   * 评论一级评论（二级评论）
   */
  commentComment: function() {
    this.setData({
      inputDisplay: 1
    });
  },

  /**
   * 删除二级评论
   */
  deleteScndComment: function(e) {
    console.log(this.data.scndComments);
    let that = this;
    console.log(that.data.commentInfo);
    console.log(e.currentTarget);
    api.request({
      url: '/incident_scnd_comment/delete.do',
      method: 'POST',
      data: {
        id: e.currentTarget.id,
        commentId: that.data.commentInfo.id,
      }
    }).then(respond => {
      console.log(respond);
      if (respond.data.status == responseCode.SUCCESS) {
        var index = e.currentTarget.dataset.index;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        var scndComments = that.data.scndComments;
        scndComments[index] = {};
        scndComments[index].delete = true;
        show.showToast('删除成功', 'success');
      } else {
        show.showToast('失败', 'fail');
      }
    });
  },

  /**
   * 评论二级评论
   */
  commentScndComment: function(e) {
    // console.log(e.currentTarget);
    // console.log("commentScnd");
    this.setData({
      inputDisplay: 2,
      scndCommentId: e.currentTarget.id,
      scndCommentIndex: e.currentTarget.dataset.index,
    });
  },

  /**
   * 点赞二级评论
   */
  thumbUpScndComment: function(e) {
    console.log(e);
    let that = this;
    var index = e.currentTarget.dataset.index;
    api.request({
      url: '/incident_scnd_comment/thumb_up.do',
      method: 'POST',
      data: {
        id: e.currentTarget.id,
      }
    }).then(respond => {
      console.log(that.data.scndComments)
      let response = respond.data;
      console.log(respond);
      if (response.status == responseCode.THUMB_UP_SUCCESS) {
        var scndComments = that.data.scndComments;
        scndComments[index].thumbUps = scndComments[index].thumbUps + 1;
        scndComments[index].thumbUp = true;
        that.setData({
          scndComments: scndComments
        });
        show.showToast('点赞成功', 'success');
      } else if (response.status == responseCode.CANCEL_THUMB_UP_SUCCESS) {
        var scndComments = that.data.scndComments;
        scndComments[index].thumbUps = scndComments[index].thumbUps - 1;
        scndComments[index].thumbUp = false;
        that.setData({
          scndComments: scndComments
        });
        show.showToast('取消点赞成功', 'success');
      } else {
        show.showToast('失败', 'fail');
      }
    })
  },

  /**
   * 预览图片
   */
  showImage: function(e) {
    console.log(e.currentTarget.dataset.url);
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getNextPage();
  },

  /**
   * 输入框获焦
   */
  inputFocus(e) {
    this.setData({
      inputBottom: e.detail.height,
    });
    console.log(this.data.inputBottom);
  },

  /**
   * 输入框失焦
   */
  inputBlur(e) {
    this.setData({
      inputBottom: 0,
      // inputDisplay: 0
    });
  },

  /**
   * 获取评论框中输入的内容
   */
  getInput: function(e) {
    this.setData({
      comment: e.detail.value
    });
  },

  /**
   * 发送评论
   */
  sendComment: function(e) {
    if (this.data.inputDisplay == 0) {
      return;
    }
    var parScndCommentId = 0;
    if (this.data.inputDisplay == 2) {
      parScndCommentId = this.data.scndCommentId;
    }
    let that = this;
    api.request({
      url: '/incident_scnd_comment/upload_comment.do',
      method: 'POST',
      data: {
        incidentCommentId: that.data.commentInfo.id,
        parScndCommentId: parScndCommentId,
        comment: that.data.comment,
      }
    }).then(respond => {
      let response = respond.data;
      console.log("@");
      console.log(respond);
      var index = that.data.commentIndex;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var comment = prevPage.data.postInfo.incidentCommentVoList;
      if (response.status == responseCode.SUCCESS) {
        comment.comments = comment.comments + 1;
        prevPage.setData({
          'postInfo.incidentCommentVoList': comment
        });
        var commentInfo = that.data.commentInfo;
        if (that.data.inputDisplay == 1) {
          that.setData({
            'commentInfo.comments': that.data.commentInfo.comments + 1
          });
          this.getNextPage();
        } else {
          var index = that.data.scndCommentIndex;
          var scndComments = that.data.scndComments;
          scndComments[index].comments = scndComments[index].comments + 1;
          that.setData({
            scndComments: scndComments
          });
        }
        this.setData({
          comment: '',
          anon: false
        })
        show.showToast('评论成功', 'success');
      } else {
        console.log(respond);
        show.showToast("失败", 'fail');
      }
    });
  },
})