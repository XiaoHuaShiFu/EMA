const app = getApp();
const api = require('../../../utils/API.js');

Page({
  data: {
    tabCur: 0,
    scrollLeft: 0,
    height: 0,
    tabs: ['事件','评论'],
    incidentMaxPage: 1,
    commentMaxPage: 1,
    incidentHeight: 0,
    commentHeight: 0,
    incidents: [],
    comments: []
  },
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    });
    console.log("switch to "+this.data.tabCur);
    this.getNextPage();
  },
  onLoad: function(options) {
    this.getIncidentNextPage();
    this.getCommentNextPage();
  },
  getNextPage: function () {
    let that = this;
    if(this.data.tabCur == 0) {
      this.getIncidentNextPage();
    }
    else {
      this.getCommentNextPage();
    }
  },

  getIncidentNextPage: function () {
    let that = this;
    api.request({
      url: '/incident/attention_list.do',
      method: "POST",
      data: {
        pageNum: this.data.incidentMaxPage,
        pageSize: 7
      }
    }).then(respond => {
      let result = respond.data.data;
      console.log(result);
      if (result.size > 0) {
        let incidentsList = result.list;
        let incidents = this.data.incidents;
        for (var key in incidentsList) {
          incidents.push(incidentsList[key]);
        }
        this.setData({
          incidents: incidents,
          incidentMaxPage: this.data.incidentMaxPage + 1
        })
        console.log(incidents);
        var query = wx.createSelectorQuery();
        query.select('.tab1').boundingClientRect(function (rect) {
          console.log("height:" + rect.height);
          that.setData({
            height: rect.height
          });
        }).exec();
        console.log(this.data.height);
      } else {

      }

    });
  },

  getCommentNextPage: function (e) {
    let that = this;
    api.request({
      url: '/incident_comment/collection_list.do',
      method: "POST",
      data: {
        pageNum: this.data.commentMaxPage,
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
          commentMaxPage: this.data.commentMaxPage + 1
        })
        console.log(comments);
        var query = wx.createSelectorQuery();
        query.select('.tab2').boundingClientRect(function (rect) {
          console.log("height:" + rect.height);
          that.setData({
            height: rect.height
          });
        }).exec();
        console.log(this.data.height);
      } else {

      }

    });
  }

})