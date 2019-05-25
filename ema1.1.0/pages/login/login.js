// pages/login/login.js
const responseCode = require('../../common/ResponseCode.js');
const api = require('../../utils/API.js');
const app = getApp();
const stringUtils = require('../../utils/StringUtils.js');
const objectUtils = require('../../utils/ObjectUtils.js');
const login = require('../../utils/Login.js');
const show = require('../../utils/Show.js');
Page({
    data: {
        toPage: null,
    },
    onLoad: function (options) {
        if (options.toPage) {
            this.setData({
                toPage: options.toPage
            })
        }
        //如果用户信息未存在，则尝试登录
        if (objectUtils.isEmpty(app.globalData.user)) {
            login.login().then(res => {
                if (res == responseCode.SUCCESS) {
                    this.switchPage(this.data.toPage);
                }
            })
        }
    },
    /**
     * onGetUserInfo事件
     */
    onGetUserInfo: function (e) {
        //直接调用登录函数
        login.login().then(response => {
            if (response == responseCode.SUCCESS) {
                this.switchPage(this.data.toPage);
            }
            //用户不存在，执行注册流程
            else if (response == responseCode.USER_NOT_EXIST) {
                this.doUserRegister(e.detail.userInfo);
            }
            else {
                show.showModal("登录失败，请重试");
            }
        })
    },
    /**
     * 用户注册，调用/user/register.do
     */
    doUserRegister: function (userInfo) {
        let that = this;
        wx.login({
            success(res) {
                if (res.code) {
                    api.request({
                        url: '/user/register.do',
                        method: "POST",
                        data: {
                            code: res.code,
                            nickName: userInfo.nickName,
                            gender: userInfo.gender,
                            avatarUrl: userInfo.avatarUrl
                        }
                    }).then(respond => {
                        let statusCode = respond.data.status;
                        //注册成功，调用登录函数
                        if (statusCode == responseCode.SUCCESS) {
                            login.login().then(response0 => {
                                if (response0 == responseCode.SUCCESS) {
                                    that.switchPage(that.data.toPage);
                                } else {
                                    show.showModal('授权成功，但未完成登录，请重试');
                                }
                            })
                        }
                        //如果出错，注册失败，用户存在，都让用户重试
                        else if (statusCode == responseCode.ERROR ||
                            statusCode == responseCode.REGISTER_FALSE ||
                            statusCode == responseCode.USER_EXIST) {
                            show.showModal('授权失败，请重试')
                        }
                        //未知错误
                        else {
                            show.showModal('授权失败，请重试')
                        }
                    })
                } else {
                    show.showModal('授权失败，请重试');
                }
            }
        })
    },
    /**
     * 切换页面
     */
    switchPage: function (toPage) {
        if (stringUtils.isEmpty(toPage)) {
            wx.switchTab({
                url: '../index/index'
            });
            // wx.redirectTo({
            //   url: '../commentDetail/commentDtail?id=53&value=52',
            // });
        } else {
            wx.redirectTo({
                url: '../' + toPage,
            });
        }
    }
})