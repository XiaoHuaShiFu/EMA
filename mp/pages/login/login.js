// pages/login/login.js
const login = require("../../utils/Login.js");
const api = require('../../utils/API.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.request({
            url: "https://api.bidadada.top/incident/list.do",
            method: "GET",
            data: {
                pageNum: 1,
                pageSize: 6
            },
            success: (res) => {
                console.log(res)
            }
        })
        console.log(login.login());
        wx.chooseLocation({
            success:function(res){
                console.log(res);
            }
        })
        // let arr = []
        // wx.request({
        //     url: "https://localhost:8443/incident/report_incident.do",
        //     method: 'POST',
        //     data: {
        //        tags:["中毒", "卫生"]
        //     },
        //     header: {
        //         'content-type': 'application/x-www-form-urlencoded'
        //     },
        //     success: function(res){
        //         console.log(res);
        //     }
        // })
       
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})