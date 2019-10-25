//app.js

App({

  util: require('./util/util'),
  
  // 文案
  text: require('./util/global'),

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.push = require('/manager/Push');

    // 登录态判断
    this.globalData.userInfo = wx.getStorageSync('userInfo') == "" ? null : wx.getStorageSync('userInfo');
    this.globalData.partnerInfo = wx.getStorageSync('partnerInfo') == "" ? null : wx.getStorageSync('partnerInfo');
    
    // iPhoneX 判断
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        //model中包含着设备信息
        var model = res.model
        if (model.search('iPhone X') != -1) {
          that.globalData.iPhoneX = true;
          that.globalData.navHeight = 90;       /* iPhoneX 44 + 46 */
          that.globalData.headerHeight = 210;   /* iPhoneX 44 + 46 + 120 */
          that.globalData.tabBarHeight = 83;    /* iPhoneX 34 + 49 */
        } else {
          that.globalData.iPhoneX = false;
          that.globalData.navHeight = 66;       /* 普通手机 20 + 46 */ 
          that.globalData.headerHeight = 166;   /* 普通手机 20 + 46 + 100 */ 
          that.globalData.tabBarHeight = 49;    /* 普通手机 49 */

        }

        that.globalData.statusBarHeight = res.statusBarHeight;
      }
    });
  },

  /**
   * 后台监听
   */
  onHide: function() {
    this.uploadFormID();
  },

  /**
   * 上传token
   */
  uploadFormID: function() {
    let ids = this.globalData.formIds;
    
    if (ids.length == 0) {
      return ;
    }

    let formId = ids.pop();

    this.push.upload(formId).then(res => {
      console.log("上传formID:" , formId);
      this.uploadFormID();
    }).catch(err => {
      console.log(err);
    });
  },

  globalData: {
    iPhoneX: false,
    navHeight: 0,
    headerHeight: 0,
    tabBarHeight: 0,
    userInfo: null,
    partnerInfo: null,
    needReloadData: false,    // 新添加数据之后做一个标示，方便首页刷新
    needReloadPartner: true,  // 需要刷新小伙伴信息
    habitAmount: -1,          // 已经添加习惯数量
    theme: "default",         // 主题
    formIds: [],              // 表单ID,
    habits: []                // habits _id <=> habit
  }
})