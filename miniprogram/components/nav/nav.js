// components/nav/nav.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    transparent: {
      type: Boolean,
      value: false
    },
    alwaysShow: {
      type: Boolean,
      value: false
    },
    back: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    iPhoneX: app.globalData.iPhoneX,
    show: false,
    first: true,
  },

  lifetimes: {
    attached: function() {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function() {
      if (this.data.show == true) {
        return ;
      }

      this.setData({
        show: true,
        first: false
      });
    },

    hide: function() {
      if (this.data.show == false) {
        return ;
      }

      this.setData({
        show: false,
        first: false
      });
    },

    goBack: function() {
      console.log("返回");
      
      if (getCurrentPages().length === 1) {
        return wx.reLaunch({
          url: '/pages/indexV2/index',
        });
      }

      wx.navigateBack({});
    }
  }
})
