// components/hello.js
const app = getApp();

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
    show: false,
    name: "",
    step: 0,
    text: app.text.hello
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function(name) {
      this.setData({
        show: true,
        name: name
      });
    },

    next: function() {
      if (this.data.step == 4) {
        let path =  wx.getStorageSync('invite');

        if (path) {
          wx.redirectTo({
            url: path
          });
        } else {
          wx.switchTab({
            url: '/pages/indexV2/index',
          });
        }
      } else {
        this.setData({
          step: this.data.step + 1
        });
      }
    }
  }
})
