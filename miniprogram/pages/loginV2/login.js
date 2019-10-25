// pages/about/index.js
import User from "../../manager/User.js";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: app.text.login,

    data: [{
      title: '芒果Daily',
      data: '与好朋友共享每日清单\n快去提醒Ta打卡吧'
    }],

    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.hello = this.selectComponent("#hello");
    app.globalData.needReloadPartner = false;
  },

  login: function(e) {
    this.setData({
      loading: true
    });
    
    // 拒绝授权
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      wx.showModal({
        title: '请授权',
        content: '否则您无法继续使用',
        showCancel: false
      });

      this.setData({
        loading: false
      });

      return ;
    }

    wx.cloud.callFunction({
      name: "login",
    }).then(res => {
      if (res.errMsg == "cloud.callFunction:ok") {
        let _openid = res.result.openid;
        let userInfo = e.detail.userInfo;
        userInfo._openid = _openid;

        User.login(userInfo).then(res => {
          
          app.globalData.userInfo = res.userInfo;
          wx.setStorageSync('userInfo', res.userInfo);

          app.globalData.partnerInfo = res.partnerInfo;
          wx.setStorageSync('partnerInfo', res.partnerInfo);        

          this.hello.show(userInfo.nickname);

        }).catch((err) => {
          wx.showModal({
            title: '错误',
            content: "网络异常[0]",
            showCancel: false
          });

          console.log(err);
          
        });
      } else {
        wx.showModal({
          title: '错误',
          content: "网络异常[1]",
          showCancel: false
        });
      }
    }).catch((code, msg) => {
      console.log(code, msg);
      
      wx.showModal({
        title: '错误',
        content: "网络异常[2]",
        showCancel: false
      });
    });
  },
})