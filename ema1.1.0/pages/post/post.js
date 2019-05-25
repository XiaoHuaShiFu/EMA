const responseCode = require('../../common/ResponseCode.js');
const api = require('../../utils/API.js');
const app = getApp();
const stringUtils = require('../../utils/StringUtils.js');
const objectUtils = require('../../utils/ObjectUtils.js');
const login = require('../../utils/Login.js');
const show = require('../../utils/Show.js');
const date = require('../../utils/DateUtils.js');

Page({
  data: {
    title: '',
    content: '',
    date: '',
    time: '',
    curDate: '',
    curTime: '',
    address: '',
    addressName: '',
    latitude: '',
    longitude: '',
    anon: false,
    tagsList: [],
    tags: [],
    tagsId: [],
    imageUrl: '',
    videoUrl: '',
    maxPage: 1,
    selectedNum: 0
  },

  onLoad: function() {
    var stamp = new Date();
    this.setData({
      date: date.formatDate(stamp),
      time: date.formatTime(stamp),
    });
  },

  onShow: function() {
    var stamp = new Date();
    this.setData({
      curDate: date.formatDate(stamp),
      curTime: date.formatTime(stamp)
    });
    console.log(this.data.curDate);
    console.log(this.data.curTime);
  },

  // bindDateChange: function (e) {
  //   this.setData({
  //     date: e.detail.value
  //   })
  // },

  // bindTimeChange: function (e) {
  //   this.setData({
  //     time: e.detail.value
  //   })
  // },

  // bindPlaceChange: function () {
  //   var _page = this;
  //   wx.chooseLocation({
  //     success: function (res) {
  //       console.log(res);
  //       _page.setData({
  //         place: res.name,
  //         address: res.address,
  //         latitude: res.latitude,
  //         longitude: res.longitude,
  //       })
  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     }
  //   })
  // },

  // bindTitleChange: function (e) {
  //   console.log(e);
  //   this.setData({
  //     title: e.detail.value
  //   })
  // },

  // bindContentChange: function (e) {
  //   console.log(e);
  //   this.setData({
  //     content: e.detail.value
  //   })
  // },

  // chooseImage: function (e) {
  //   var prePage = this;
  //   wx.chooseImage({
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: res => {
  //       const tempFilePaths = res.tempFilePaths;
  //       console.log(tempFilePaths)
  //       this.setData({
  //         tempFilePaths: tempFilePaths.join('')
  //       })
  //       console.log(prePage.data.tempFilePaths)
  //       api.uploadFile({
  //         url: '/incident/upload_main_image.do',
  //         filePath: prePage.data.tempFilePaths,
  //         mainImage: 'res.tempFilePaths'
  //       }).then(respond => {

  //       });
  //     }
  //   });
  // },

  // removeImage: function (e) {
  //   this.setData({
  //     tempFilePaths: 'null'
  //   })
  // },

  // chooseVideo: function (e) {
  //   var prePage = this;
  //   wx: wx.chooseVideo({
  //     sourceType: [],
  //     compressed: '',
  //     maxDuration: 0,
  //     success: function (res) {
  //       prePage.setData({
  //         src: res.tempFilePath,
  //       })
  //     },
  //     fail: function (res) {
  //       console.log('上传取消')
  //     },
  //     complete: function (res) { },
  //   })
  // },

  titleChange: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  contentChange: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  dateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
    console.log(this.data.date);
  },

  timeChange: function(e) {
    this.setData({
      time: e.detail.value
    });
    console.log(this.data.time);
  },

  getPosition: function() {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
        that.setData({
          addressName: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
        });
        console.log(that.data.addressName);
        console.log(that.data.address);
        console.log(that.data.latitude);
        console.log(that.data.longitude);
      },
      fail: function(err) {
        console.log(err);
      }
    });
  },

  /**
   * 设置匿名状态
   */
  setAnon: function(e) {
    this.setData({
      anon: e.detail.value
    });
  },


  /**
   * 上报事件
   */
  submit: function(e) {
    let that = this;
    var occurTime = this.data.date + ' ' + this.data.time + ':00';
    var tagsString = '13';
    for (var i = 0; i < this.data.tagsId.length; i++) {
      tagsString = tagsString + this.data.tagsId[i];
      if (i != this.data.tagsId.length - 1) {
        tagsString = tagsString + ', ';
      }
    }
    console.log(app.globalData.user.id);
    console.log(this.data.title);
    console.log(this.data.content);
    console.log(occurTime);
    console.log(this.data.address);
    console.log(this.data.addressName);
    console.log(this.data.latitude);
    console.log(this.data.longitude);
    console.log(this.data.anon);
    console.log(tagsString);
    api.request({
      url: '/incident/upload_incident.do',
      method: "POST",
      data: {
        userId: app.globalData.user.id,
        title: that.data.title,
        description: that.data.content,
        occurTime: occurTime,
        address: that.data.address,
        addressName: that.data.addressName,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        tags: tagsString,
        anon: that.data.anon,
      }
    }).then(respond => {
      console.log(respond);
      let response = respond.data;
      if (response.status == responseCode.SUCCESS) {
        if (this.data.imageUrl != '') {
          this.uploadMainImage(response.data.id);
        } else {
          this.postSuccess();
        }
      } else {
        this.postFail();
      }

    });
  },

  postSuccess: function() {
    show.showToast('发布成功', 'success');
    this.setData({
      title: '',
      content: '',
      address: '',
      addressName: '',
      latitude: '',
      longitude: '',
      anon: false,
      tagsList: [],
      tags: [],
      tagsId: [],
      imageUrl: '',
      videoUrl: '',
      maxPage: 1,
      selectedNum: 0
    });
    setTimeout(function() {
      wx.switchTab({
        url: '../index/index',
      });
    }, 1000);
  },

  postFail: function() {
    show.showToast('失败', 'fail');
  },

  /**
   * 上传事件主图
   */
  uploadMainImage: function(incidentId) {
    let that = this;
    console.log(this.data.imageUrl);
    if (that.data.imageUrl != "") {
      api.uploadFile({
        url: '/incident/upload_main_image.do',
        filePath: that.data.imageUrl,
        name: 'mainImage',
        formData: {
          incidentId: incidentId
        }
      }).then(respond => {
        console.log(respond);
        let response = respond.data;
        if (response.status == responseCode.SUCCESS) {
          this.postSuccess();
        } else {
          this.postFail();
        }
      })
    }
  },

  /**
   * 上传事件主视频
   */
  uploadMainVideo: function(incidentId) {
    let that = this;
    if (that.data.mainVideo != "") {
      api.uploadFile({
        url: '/incident/upload_main_video.do',
        filePath: that.data.mainVideo,
        name: 'mainVideo',
        formData: {
          incidentId: incidentId
        }
      }).then(respond => {
        console.log(respond)
      })
    }
  },

  /**
   * 选择图片
   */
  chooseImage: function() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res);
        that.setData({
          imageUrl: res.tempFilePaths[0]
        });
      }
    });
  },


  /**
   * 选择或拍摄视频
   */
  chooseMainVideo: function() {
    let that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        that.setData({
          mainVideo: res.tempFilePath
        });
      }
    });
  },


  /**
   * 预览图片
   */
  showImage: function(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url]
    });
  },

  /**
   * 删除图片
   */
  deleteImage: function(e) {
    this.setData({
      imageUrl: ''
    });
    // wx.showModal({
    //   title: '召唤师',
    //   content: '确定要删除这段回忆吗？',
    //   cancelText: '再看看',
    //   confirmText: '再见',
    //   success: res => {
    //     if (res.confirm) {
    //       this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    //       this.setData({
    //         imgList: this.data.imgList
    //       })
    //     }
    //   }
    // });
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      maxPage: 1,
      tagsList: []
    });
    this.getNextPage();
  },

  hideModal(e) {
    var tagsList = this.data.tagsList;
    var tags = [];
    var tagsId = [];
    for (var key in tagsList) {
      if (tagsList[key].checked) {
        tags.push(tagsList[key].name);
        tagsId.push(tagsList[key].id);
      }
    }
    this.setData({
      modalName: null,
      tags: tags,
      tagsId: tagsId
    });

  },

  chooseTag(e) {
    // let items = this.data.tagsList;
    var index = e.currentTarget.id;
    var tagsList = this.data.tagsList;
    // var tags = this.data.tags;
    // var tagsId = this.data.tagsId;
    // for (let i = 0, lenI = items.length; i < lenI; ++i) {
    //   if (items[i].value == values) {
    //     items[i].checked = !items[i].checked;
    //     break;
    //   }
    // }
    var selectedNum = this.data.selectedNum;
    if(tagsList[index].checked) {
      selectedNum = selectedNum - 1;
    }
    else {
      selectedNum = selectedNum + 1;
    }
    tagsList[index].checked = !tagsList[index].checked;
    // tags.push(tagsList[index].name);
    // tagsId.push(tagsList[index].id);
    this.setData({
      tagsList: tagsList,
      selectedNum: selectedNum
      // tags: tags,
      // tagsId: tagsId
    });
    console.log(tagsList);
    console.log(selectedNum);
    // console.log(tags);
    // console.log(tagsId);
  },
  reachBottom: function() {
    console.log("Bottom");
    this.getNextPage();
  },


  getNextPage: function() {
    let that = this;
    api.request({
      url: '/tag/list.do',
      method: "POST",
      data: {
        pageNum: this.data.maxPage,
        pageSize: 21
      }
    }).then(respond => {
      console.log(respond);
      let result = respond.data.data;
      let label = result.list;
      var tagsList = that.data.tagsList;
      var tagsId = that.data.tagsId;
      for (var key in label) {
        for (var inx in tagsId) {
          console.log(label[key].id + " " + tagsId[inx]);
          if (label[key].id == tagsId[inx]) {
            label[key].checked = true;
            break;
          }
        }
        tagsList.push(label[key]);
      }
      this.setData({
        pageNum: this.data.maxPage+1,
        tagsList: tagsList
      })
      console.log(this.data.tagsList);
    });
  }

})