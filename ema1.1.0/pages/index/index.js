const app = getApp();
const api = require('../../utils/API.js');
const responseCode = require('../../common/ResponseCode.js');
const show = require('../../utils/Show.js');

Page({
  data: {
    user: null,
    key: '',
    posts: [],
    maxPage: 1
  },

  onLoad: function() {
    this.setData({
      user: app.globalData.user,
      posts: [],
      maxPage: 1
    });
    this.getNextPage();
  },

  getNextPage: function() {
    // 按关键词搜索
    if (this.data.key.length > 0) {
      api.request({
        url: '/incident/search.do',
        method: "POST",
        data: {
          title: this.data.key,
          pageNum: this.data.maxPage,
          pageSize: 5
        }
      }).then(respond => {
        let result = respond.data.data;
        console.log("result=");
        console.log(result);
        if (result.size > 0) {
          let postsList = result.list;
          let posts = this.data.posts;
          for (var key in postsList) {
            posts.push(postsList[key]);
          }
          this.setData({
            posts: posts,
            maxPage: this.data.maxPage + 1
          })
          console.log("posts=");
          console.log(posts);
        } else {

        }

      });
    }
    // 无关键词
    else {
      api.request({
        url: '/incident/list.do',
        method: "POST",
        data: {
          pageNum: this.data.maxPage,
          pageSize: 5
        }
      }).then(respond => {
        let result = respond.data.data;
        console.log("respond=");
        console.log(respond);
        if (result.size > 0) {
          let postsList = result.list;
          let posts = this.data.posts;
          for (var key in postsList) {
            posts.push(postsList[key]);
          }
          this.setData({
            posts: posts,
            maxPage: this.data.maxPage + 1
          })
          console.log("posts=");
          console.log(posts);
        } else {

        }

      });
    }
  },

  /**
   * 关注事件
   */
  collectIncident: function(e) {
    console.log(e.currentTarget.id);
    var id = e.currentTarget.id;
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
      var index = e.currentTarget.dataset.index;
      var posts = that.data.posts;
      if (result.status == responseCode.ATTENTION_SUCCESS) {
        posts[index].attentions = posts[index].attentions + 1;
        posts[index].attention = true;
        that.setData({
          posts: posts
        });
        show.showToast('关注成功', 'success');
      } else if (result.status == responseCode.CANCEL_ATTENTION_SUCCESS) {
        posts[index].attentions = posts[index].attentions - 1;
        posts[index].attention = false;
        that.setData({
          posts: posts
        });
        show.showToast('取消关注成功', 'success');
      } else {
        show.showToast('失败', 'fail');
      }
    });
  },

  /**
   * 搜索
   */
  search: function(e) {
    let key = e.detail.value;
    this.setData({
      key: key,
      posts: [],
      maxPage: 1
    });
    this.getNextPage();
  },

  /**
   * 预览图片
   */
  showImage: function(e) {
    console.log(e.currentTarget.dataset.url);
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
  },

  /**
   * 预览视频
   */
  showVideo: function(e) {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      key: '',
      posts: [],
      maxPage: 1
    });
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getNextPage();
  },

  showPosition: function(e) {
    var index = e.currentTarget.id;
    let post = this.data.posts[index];
    console.log(e);
    wx.navigateTo({
      url: '../positionDetail/positionDetail?latitude=' + post.latitude + '&longitude=' + post.longitude + '&addressName=' + post.addressName + '&address=' + post.address,
    });
  }

})