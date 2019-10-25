// components/add/add.js
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
    display: false,
    animating: false,

    bottom: (app.globalData.iPhoneX ? 68 : 0)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show: function() {
      if (this.data.animating) {
        return ;
      }

      this.setData({
        display: true,
        show: true
      });
    },

    hide: function() {
      this.setData({
        show: false,
        animating: true
      });

      setTimeout(() => {
        this.setData({
          display: false,
          animating : false
        });
      }, 500);
    }
  }
})
