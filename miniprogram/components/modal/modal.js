// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ""
    },
    close: {
      type: Boolean,
      value: false
    }
  },

  externalClasses: ['mango', 'fade-in', 'fade-out'],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    ClickHandler: function(e) {
      // 回调父层的onClickHandler函数
      this.triggerEvent('ClickHandler', e, {});
    },
    
    ClickClose: function(e) {
      this.triggerEvent('ClickClose', e, {});
    }
  }
})
