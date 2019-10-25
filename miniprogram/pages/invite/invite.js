// pages/invite/invite.js
const app = getApp();

import User from "../../manager/User";
import Partner from "../../manager/Partner";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: app.text.invite,
    navHeight: app.globalData.navHeight,

    userInfo: null,

    bg: [
      "cloud://mango-604951.6d61-mango-604951/system/invite_bg1.png",
      "cloud://mango-604951.6d61-mango-604951/system/invite_bg2.png",
      "cloud://mango-604951.6d61-mango-604951/system/invite_bg3.png"
    ],
    
    selected: 0,    // 已经选择的背景图
    name: "",
    content: "",

    user_id: null,
    invite: false,
    loading: true,   // 来自邀请界面网络加载
    user: null
  },

  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.toast = this.selectComponent("#toast");

    if (options.user_id) {
      let user_id = options.user_id;
      let name = (options.name ? decodeURIComponent(options.name) : "");
      let content = (options.content ? decodeURIComponent(options.content) : "");
      let index = options.index;

      this.setData({
        invite: true,
        user_id: user_id,
        name: name,
        content: content,
        selected: index
      });

      this.toast.showLoading();
      User.findUser(user_id).then(res => {
        this.toast.hideLoading();

        this.setData({
          loading: false,
          user: res
        });
      }).catch(err => {
        this.toast.showFailure("找不到这个人哦");
      });

    } else {
      let placeholder = this.data.text.placeholder[0];

      this.setData({
        name: placeholder.name,
        content: placeholder.content
      });
    }

  },

  /**
   * 选择背景图
   */
  selectBg: function(e) {
    let index = e.currentTarget.dataset.index;
    let placeholder = this.data.text.placeholder[index];

    this.setData({
      selected: index,
      name: placeholder.name,
      content: placeholder.content
    });
  },

  /**
   * 输入昵称
   */
  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  
  /**
   * 输入邀请语
   */
  contentInput: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  /**
   * 接受
   */
  receive: function() {
    if (this.data.userInfo) {
      this.toast.showLoading();
      
      User.myPartner(this.data.userInfo._openid).then(res => {
        if (res == null) {
          Partner.bind(this.data.userInfo._openid, this.data.user_id).then(res => {
            this.toast.showSuccess("绑定成功");

            wx.setStorageSync('invite', null);

            app.globalData.needReloadPartner = true;
            wx.reLaunch({
              url: "/pages/indexV2/index"
            });
          }).catch(err => {
            this.toast.showFailure("服务器离家出走啦");
          });
        } else {
          this.toast.hideLoading();

          wx.showModal({
            title: '你已经有小伙伴啦',
            content: '如果你想好了，你可以到设置里面与已经绑定的小伙伴解除关系。',
            showCancel: false
          });
        }
      }).catch(err => {
        this.toast.showFailure("服务器离家出走啦");
      });

    } else {
      let path = "/pages/invite/invite?user_id=" + this.data.user_id + "&index=" + this.data.selected + "&name=" + encodeURIComponent(this.data.name) + "&content=" + encodeURIComponent(this.data.content);
      wx.setStorageSync('invite', path);

      wx.redirectTo({
        url: '/pages/loginV2/login'
      });
    }

  },

  /**
   * 拒绝
   */
  reject: function() {
    wx.showModal({
      title: 'Mango Daily',
      content: '要不，我带你去首页看看吧',
      success: function(res) {
        if (res.confirm) {          
          wx.switchTab({
            url: "/pages/indexV2/index"
          });
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    wx.setStorageSync('invite', true);

    let path = "/pages/invite/invite?user_id=" + this.data.userInfo._openid + "&index=" + this.data.selected + "&name=" + encodeURIComponent(this.data.name) + "&content=" + encodeURIComponent(this.data.content);

    return {
      title: this.data.name + " " + this.data.content,
      path: path,
      success: (res) => {        
        wx.switchTab({
          url: '/pages/indexV2/index'
        });
      }
    }
  }
})