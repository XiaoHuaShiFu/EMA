 //pages/my/message/message.js
 const app = getApp();
 const api = require('../../../utils/API.js');
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     message: [],
     maxPage: 1,
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     this.getNextPage();
   },

   getNextPage: function () {
     api.request({
       url: '/user/AllInform.do',
       method: "POST",
       data: {
         pageNum: this.data.maxPage,
         pageSize: 7
       }
     }).then(respond => {
       let result = respond.data.data;
       console.log(result);
       if (result.size > 0) {
         let messageList = result.list;
         let message = this.data.message;
         for (var key in messageList) {
          //  console.log(messageList[key].content);
          //  messageList[key].content = messageList[key].content.split('，');
          //  console.log(messageList[key].content);
           message.push(messageList[key]);
         }
         this.setData({
           message: message,
           maxPage: this.data.maxPage + 1
         })
         console.log(message);
       } else {

       }

     });
   },


   getMessage: function() {
     api.request({
       url: '/user/AllInform.do',
       method: "POST",
       data: {
         pageNum: this.data.maxPage,
         pageSize: 5
       }
     }).then(respond => {
       let result = respond.data.data;
       console.log(respond.data);
       if (result.size > 0) {
         let AllmassgeList = result.list;
         let message = this.data.message;
         for (var key in AllmassgeList) {
           message.push(AllmassgeList[key]);
         }
         this.setData({
           message: message,
           maxPage: this.data.maxPage + 1
         })
         console.log(message);
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