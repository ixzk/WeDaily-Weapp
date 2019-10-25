// pages/setting/setting.js
const app = getApp();

import Partner from "../../manager/Partner";

const URL = "https://md.solikeu.com/";
const PAGE = {
  index: "",
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerHeight: app.globalData.navHeight + 20,
    showToastStyle: false,
    toastStyle: 0,

    text: app.text.setting,
  },

  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      partnerInfo: app.globalData.partnerInfo
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast");

    this.setData({
      toastStyle: wx.getStorageSync('toastStyle')
    });
  },

  /**
   * 提示框风格
   */
  cellToastStyle: function() {
    this.setData({
      showToastStyle: !this.data.showToastStyle
    });
  },

  /**
   * 修改提示框风格
   */
  changeToastStyle: function(e) {
    let style = e.currentTarget.dataset.style;
    wx.setStorageSync('toastStyle', style);
    
    this.toast.showSuccess("设置成功");
    
    this.setData({
      toastStyle: style
    });
  },

  /**
   * 解绑
   */
  unbind: function() {
    let that = this;

    wx.showModal({
      title: '警告',
      content: '这个选项不可以乱点的',
      confirmColor: '#E64340',
      success: function(res) {
        if (res.confirm) {
          wx.showModal({
            title: '再次警告',
            content: '确定与好友解除绑定吗',
            confirmColor: '#E64340',
            success: function(res) {
              if (res.confirm) {
                that.toast.showLoading();

                Partner.unbind(that.data.userInfo._openid, that.data.partnerInfo._openid).then(res => {
                  that.toast.showSuccess(res);

                  setTimeout(() => {
                    wx.reLaunch({
                      url: '/pages/indexV2/index'
                    });
                  }, 2000);

                }).catch(err => {
                  console.log(err);
                  
                  that.toast.showFailure(err);
                });
                
              }
            }
          });
        }
      }
    });
  },

  /**
   * 刷新绑定信息
   */
  reload: function() {
    app.globalData.needReloadPartner = true;
    
    wx.reLaunch({
      url: '/pages/indexV2/index'
    });
  },

  /**
   * 点击cell
   */
  cellClick: function(e) {
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '/pages/about/about?type=' + type
    });
  },

  /**
   * 复制内容
   */
  copyUrl: function(e) {    
    let page = PAGE[e.currentTarget.dataset.page];
    let url = URL + page;

    wx.setClipboardData({
      data: url,
      complete: function() {
        wx.showModal({
          title: '已复制链接',
          content: '请在浏览器打开',
          showCancel: false
        });
      }
    });
  }
})