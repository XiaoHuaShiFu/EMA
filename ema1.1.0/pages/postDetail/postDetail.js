const app = getApp();
const api = require('../../utils/API.js');
const responseCode = require('../../common/ResponseCode.js');
const show = require('../../utils/Show.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    postInfo: '',
    comment: '',
    commentId: 0,
    commentIndex: 0,
    inputDisplay: 0,
    inputBottom: 0,
    incidentIndex: 0,
    anon: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options);
    if (options.id > 0) {
      api.request({
        url: '/incident/view.do',
        method: "POST",
        data: {
          id: options.id
        }
      }).then(respond => {
        let response = respond.data;
        console.log(respond);
        if (response.status == responseCode.SUCCESS) {
          api.request({
            url: '/incident/get_incident.do',
            method: "POST",
            data: {
              id: options.id
            }
          }).then(respond => {
            let response = respond.data;
            console.log(respond);
            if (response.status == responseCode.SUCCESS) {
              that.setData({
                postInfo: response.data,
                user: app.globalData.user,
                incidentIndex: options.value
              });
              var index = options.value;
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              var posts = prevPage.data.posts;
              console.log(posts[index]);
              console.log(that.data.postInfo);
              posts[index].views = posts[index].views + 1;
              prevPage.setData({
                posts: posts
              });
              console.log(options);
              console.log(this.data.postInfo.incidentCommentVoList);
            } else {
              console.log(response.msg);
              this.showFail();
            }
          });
        } else {
          this.showFail();
        }
      });
    } else {
      this.showFail();
    }
  },

  showFail: function() {
    show.showToast('失败', 'fail');
    setTimeout(function() {
      wx.navigateBack({
        delta: 1,
      });
    }, 1000);
  },

  /**
   * 关注事件
   */
  collectIncident: function() {
    console.log(this.data.postInfo);
    var id = this.data.postInfo.id;
    let that = this;
    api.request({
      url: '/incident/attention.do',
      method: "POST",
      data: {
        id: id
      }
    }).then(respond => {
      let result = respond.data;
      console.log(respond);
      var index = that.data.incidentIndex;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      var posts = prevPage.data.posts;
      if (result.status == responseCode.ATTENTION_SUCCESS) {
        posts[index].attentions = posts[index].attentions + 1;
        posts[index].attention = true;
        prevPage.setData({
          posts: posts
        });
        that.setData({
          'postInfo.attentions': that.data.postInfo.attentions + 1,
          'postInfo.attention': 1
        });
        show.showToast('关注成功', 'success');
      } else if (result.status == responseCode.CANCEL_ATTENTION_SUCCESS) {
        posts[index].attentions = posts[index].attentions - 1;
        posts[index].attention = false;
        prevPage.setData({
          posts: posts
        });
        that.setData({
          'postInfo.attentions': that.data.postInfo.attentions - 1,
          'postInfo.attention': 0
        });
        show.showToast('取消关注成功', 'success');
      } else {
        show.showToast('失败', 'fail');
      }
    });
  },

  /**
   * 删除事件
   */
  deleteIncident: function() {
    console.log(this.data.postInfo);
    console.log(this.data.postInfo.id);
    api.request({
      url: '/incident/delete.do',
      method: 'POST',
      data: {
        id: this.data.postInfo.id,
      }
    }).then(respond => {
      console.log(respond);
      let response = respond.data;
      if (response.status == responseCode.SUCCESS) {
        var index = this.data.incidentIndex;
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        var posts = prevPage.data.posts;
        posts[index].deleted = true;
        prevPage.setData({
          posts: posts
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
   * 评论事件(一级评论)
   */
  commentIncident: function() {
    if(this.data.inputDisplay == 1) {
      this.setData({
        inputDisplay: 0,
        inputBottom: 0,
      });
    }
    else {
      this.setData({
        inputDisplay: 1
      });
    }
  },

  /**
   * 点赞评论
   */
  thumbUpComment: function(e) {
    console.log(this.data.postInfo);
    let that = this;
    let index = e.currentTarget.dataset.index;
    var postInfo = this.data.postInfo;
    api.request({
      url: '/incident_comment/thumb_up.do',
      method: 'POST',
      data: {
        id: e.currentTarget.id
      }
    }).then(respond => {
      let result = respond.data;
      console.log(respond);
      if (result.status == responseCode.THUMB_UP_SUCCESS) {
        postInfo.incidentCommentVoList[index].thumbUps = postInfo.incidentCommentVoList[index].thumbUps + 1;
        postInfo.incidentCommentVoList[index].thumbUp = true;
        that.setData({
          postInfo: postInfo
        });
        show.showToast('点赞成功', 'success');
      } else if (result.status == responseCode.CANCEL_THUMB_UP_SUCCESS) {
        postInfo.incidentCommentVoList[index].thumbUps = postInfo.incidentCommentVoList[index].thumbUps - 1;
        postInfo.incidentCommentVoList[index].thumbUp = false;
        that.setData({
          postInfo: postInfo
        });
        show.showToast('取消点赞成功', 'success');
      } else {
        show.showToast('失败', 'fail');
      }
    })
  },

  /**
   * 关注评论
   */
  collectComment: function(e) {
    // console.log(e);
    console.log(this.data.postInfo);
    console.log(e.currentTarget.id);
    let that = this;
    let index = e.currentTarget.dataset.index;
    var postInfo = this.data.postInfo;
    api.request({
      url: '/incident_comment/collect.do',
      method: 'POST',
      data: {
        id: e.currentTarget.id
      }
    }).then(respond => {
      let result = respond.data;
      console.log(respond);
      if (result.status == responseCode.COLLECTION_SUCCESS) {
        postInfo.incidentCommentVoList[index].collections = postInfo.incidentCommentVoList[index].collections + 1;
        postInfo.incidentCommentVoList[index].collection = true;
        that.setData({
          postInfo: postInfo
        });
        show.showToast('收藏成功', 'success');
      } else if (result.status == responseCode.CANCEL_COLLECTION_SUCCESS) {
        postInfo.incidentCommentVoList[index].collections = postInfo.incidentCommentVoList[index].collections - 1;
        postInfo.incidentCommentVoList[index].collection = false;
        that.setData({
          postInfo: postInfo
        });
        show.showToast('取消收藏成功', 'success');
      } else {
        show.showToast('失败', 'fail');
      }
    })
  },

  /**
   * 评论评论(二级评论)
   */
  commentComment: function(e) {
    // console.log(e.currentTarget.id);
    // console.log(e.currentTarget);
    if(this.data.inputDisplay == 2 && this.data.commentId == e.currentTarget.id) {
      this.setData({
        inputDisplay: 0,
        inputBottom: 0,
      })
    }
    else {
      this.setData({
        inputDisplay: 2,
        commentId: e.currentTarget.id,
        commentIndex: e.currentTarget.dataset.index
      });
    }
    // console.log(this.data.inputDisplay)
  },

  /**
   * 图片预览
   */
  showImage: function(e) {
    console.log(e.currentTarget.dataset.url);
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
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
    let that = this;
    console.log("inputDisplay=" + this.data.inputDisplay);
    if (this.data.inputDisplay == 1) {
      api.request({
        url: '/incident_comment/upload_comment.do',
        method: 'POST',
        data: {
          incidentId: that.data.postInfo.id,
          userId: that.data.user.id,
          comment: that.data.comment,
          anon: that.data.anon
        }
      }).then(respond => {
        console.log(respond);
        let response = respond.data;
        if (response.status == responseCode.SUCCESS) {
          api.request({
            url: '/incident_comment/get_comment.do',
            method: "POST",
            data: {
              id: response.data,
            }
          }).then(respond => {
            console.log(respond);
            let response = respond.data;
            if (response.status == responseCode.SUCCESS) {
              var postInfo = that.data.postInfo;
              postInfo.comments = postInfo.comments + 1;
              postInfo.incidentCommentVoList.push(response.data);
              that.setData({
                postInfo: postInfo,
                comment: '',
                anon: false,
                inputDisplay: 0
              });
              var index = that.data.incidentIndex;
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];
              var posts = prevPage.data.posts;
              console.log("log");
              console.log(posts);
              console.log(posts[index]);
              console.log(posts[index].comments);
              posts[index].comments = that.postInfo.comments;
              prevPage.setData({
                posts: posts
              });
              show.showToast('评论成功', 'success');
            } else {
              show.showToast("失败", 'fail');
            }
          });
        } else {
          show.showToast("失败", 'fail');
        }
      });
    } else {
      var index = this.data.commentIndex
      api.request({
        url: '/incident_scnd_comment/upload_comment.do',
        method: 'POST',
        data: {
          incidentCommentId: that.data.commentId,
          parScndCommentId: 0,
          comment: that.data.comment,
        }
      }).then(respond => {
        let response = respond.data;
        if (response.status == responseCode.SUCCESS) {
          var postInfo = that.data.postInfo;
          postInfo.incidentCommentVoList[that.data.commentIndex].comments = postInfo.incidentCommentVoList[that.data.commentIndex].comments + 1;
          that.setData({
            postInfo: postInfo
          });
          show.showToast('评论成功', 'success');
        } else {
          console.log(respond);
          show.showToast("失败", 'fail');
        }
      });
    }
  },

  setAnon: function () {
    if(this.data.inputDisplay != 2) {
      var anon = !this.data.anon;
      this.setData({
        anon: anon
      });
    }
  }
})