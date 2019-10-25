// pages/about/about.js
const app = getApp();

const TYPE = {
  ABOUT_ZERO: "zero",     // 关于作者
  TUTORIAL:   "tutorial", // 使用教程
  DEV_LOG:    "log",      // 开发日记
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: TYPE.ABOUT_ZERO,

    text: app.text.about,
    headerHeight: app.globalData.navHeight + 20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    if (type == null) {
      type = TYPE.ABOUT_ZERO;
    }

    if (type == TYPE.DEV_LOG) {
      // 开发日记 播放音乐

      wx.showToast({
        title: '该页面有背景音乐，请注意调整音量',
        icon: 'none',
        duration: 2000
      });

      wx.playBackgroundAudio({
        dataUrl: 'http://music.163.com/song/media/outer/url?id=17177324.mp3'
      });
    }

    this.setData({
      type: type
    });
  },

  /**
   * 复制内容
   */
  copy: function(e) {   
    let data = ""; 

    if (this.data.type == TYPE.ABOUT_ZERO) {
      data = "110444480";
    }

    wx.setClipboardData({
      data: data
    });
  },

  onUnload: function() {
    wx.stopBackgroundAudio();
  }
})