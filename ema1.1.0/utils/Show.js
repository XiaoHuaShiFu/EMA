module.exports = {
    showModal: showModal,
    showToast: showToast
}

/**
 * 一些提示的组件
 */
function showModal(content) {
    wx.showModal({
        showCancel: false,
        content: content
    })
}

function showToast(title, type) {
  wx.showToast({
    title: title,
    image: '/image/'+type+'.png',
    duration: 1000
  })
}