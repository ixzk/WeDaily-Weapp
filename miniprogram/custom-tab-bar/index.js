// custom-tab-bar/index.js
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
    page: null,

    theme: wx.getStorageSync('toastStyle'),

    selected: -1,
    centerIndex: 2,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/indexV2/index",
      iconPath: "/images/tabBar/index.png",
      selectedIconPath: "/images/tabBar/index_s.png",
      text: "今天"
    }, {
      pagePath: "/pages/square/square/square",
      iconPath: "/images/tabBar/square.png",
      selectedIconPath: "/images/tabBar/square_s.png",
      text: "广场"
    }, {
      pagePath: "/pages/award/award/award",
      iconPath: "/images/tabBar/award.png",
      selectedIconPath: "/images/tabBar/award_s.png",
      text: "奖励"
    }, {
      pagePath: "/pages/mineV2/mine",
      iconPath: "/images/tabBar/mine.png",
      selectedIconPath: "/images/tabBar/mine_s.png",
      text: "我"
    }],
  },

  lifetimes: {
    attached: () => {}
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show() { 
      
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    switchTab(e) {

      const data = e.currentTarget.dataset
      const url = data.path

      if (this.data.selected != data.index) {
        wx.switchTab({url})
        this.setData({
          selected: data.index
        });
      }
    },

    /**
     * 点击添加按钮
     */
    add() {
      let page = this.data.page;
      let component = null;
      if (page == null || (component = page.selectComponent("#add")) == null) {
        return ;
      }

      let show = component.data.show;
      if (show) {
        component.hide();
      } else {
        component.show();
      }
    }
  }
})
