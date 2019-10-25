// components/toast.js

// 弹窗风格
const TOAST_STYLE = {
  DEFAULT:  0,
  MANGO:    1
};


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden: true,
    icon: "success",
    text: "loading",
    style: (wx.getStorageSync('toastStyle') ? wx.getStorageSync('toastStyle') : TOAST_STYLE.DEFAULT)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLoading: function (text = "") {
      this.setData({
        style: (wx.getStorageSync('toastStyle') ? wx.getStorageSync('toastStyle') : TOAST_STYLE.DEFAULT),
        hidden: false,
        icon: "loading",
        text: text
      });
    },

    hideLoading: function () {
      this.setData({
        hidden: true
      });
    },

    showSuccess: function(text = "") {
      this.setData({
        style: (wx.getStorageSync('toastStyle') ? wx.getStorageSync('toastStyle') : TOAST_STYLE.DEFAULT),
        hidden: false,
        icon: "success",
        text: text
      });

      let that = this;
      setTimeout(() => {
        that.setData({
          hidden: true
        });
      }, 1800);
    },

    showFailure: function(text = "") {
      this.setData({
        style: (wx.getStorageSync('toastStyle') ? wx.getStorageSync('toastStyle') : TOAST_STYLE.DEFAULT),
        hidden: false,
        icon: "failure",
        text: text
      });

      let that = this;
      setTimeout(() => {
        that.setData({
          hidden: true
        });
      }, 1800);
    },

    showWarning: function(text = "") {
      this.setData({
        style: (wx.getStorageSync('toastStyle') ? wx.getStorageSync('toastStyle') : TOAST_STYLE.DEFAULT),
        hidden: false,
        icon: "warning",
        text: text
      });

      let that = this;
      setTimeout(() => {
        that.setData({
          hidden: true
        });
      }, 1800);
    }
  }
})
