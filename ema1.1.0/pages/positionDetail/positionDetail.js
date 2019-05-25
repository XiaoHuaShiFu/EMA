// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [{
      id: 0,
      latitude: 0,
      longitude: 0,
      callout: {
          content: '',
          fontSize: "16",
          borderRadius: "10",
          borderColor: "#C0C0C0",
          bgColor: "#ffffff",
          padding: "10",
          display: "ALWAYS",
          borderWidth: "1rpx"
        // borderRaius: 4,
        // content: '详细地址',
        // color: '#ffffff',
        // padding: 8,
        // display: 'ALWAYS'
      }
    }],
    // address: '',
    // addressName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      'markers[0].latitude': options.latitude,
      'markers[0].longitude': options.longitude,
      'markers[0].callout.content': options.addressName,
      // address: options.address,
      // addressName: options.addressName
    });

    this.mapCtx = wx.createMapContext('myMap');
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
      }
    });
  },
})