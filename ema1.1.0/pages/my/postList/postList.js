const app = getApp();
const api = require('../../../utils/API.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    maxPage: 1,
    type: '',
    typeList: ['/incident/report_list.do', '/incident/attention_list.do', '/incident/view_list.do'],
    // 0 我的发布 1 我的关注事件 2 最近浏览
    avatarUrl: '',
    nickName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.value);
    if(options.value == 0) {
      wx.setNavigationBarTitle({
        title: '我的发布',
      });
    }
    else if(options.value == 1) {
      wx.setNavigationBarTitle({
        title: '我的关注',
      });
    }
    else {
      wx.setNavigationBarTitle({
        title: '最近浏览',
      });
    }
    let user = app.globalData.user;
    this.setData({
      type: options.value,
      avatarUrl: user.avatarUrl,
      nickName: user.nickName
    })
    this.getNextPage();
  },

  getNextPage: function() {
    api.request({
      url: this.data.typeList[this.data.type],
      method: "POST",
      data: {
        pageNum: this.data.maxPage,
        pageSize: 15
      }
    }).then(respond => {
      let result = respond.data.data;
      console.log("respond=");
      console.log(respond);
      if (result.size > 0) {
        let postsList = result.list;
        let posts = this.data.posts;
        for (var key in postsList) {
          let item = postsList[key];
          if(item == null){
            continue;
          }
          if (this.data.type != 2) {
            posts.push(item);
          } else {
            posts.push({
              id: item.incidentId,
              title: item.incidentTitle,
              views: item.views,
              attentions: item.attentions,
              comments: item.comments
            });
          }
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
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getNextPage();
  },
})