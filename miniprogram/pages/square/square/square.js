// pages/square/square/square.js
import Article from "../../../manager/Article";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: app.text.square.square,
    headerHeight: app.globalData.navHeight + 20,

    page: 0,
    lists: [],
    noMore: false,

    myVisual: false,     // 当前视角 true是我，false是广场
  },

  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        page: this
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav = this.selectComponent("#nav");
    this.toast = this.selectComponent("#toast");

    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData: function() {
    let userInfo = app.globalData.userInfo;
    let partnerInfo = app.globalData.partnerInfo;

    this.toast.showLoading();
    Article.lists(this.data.page, (this.data.myVisual ? userInfo._openid : null),(partnerInfo == null ? null : partnerInfo._openid)).then(res => {
      this.toast.hideLoading();
      wx.stopPullDownRefresh();

      let lists = (this.data.page == 0 ? [] : this.data.lists);
      res.forEach((item, _) => {
        let time = app.util.formatTime(item.time, false, false);
        time = time.split("-");
        item.formatTime = time[1] + "-" + time[2];
        item.formatTimeFull = app.util.formatTime(item.time, true, false);
        lists.push(item);
      });      

      this.setData({
        page: this.data.page + 1,
        lists: lists,
        noMore: (res.length == 0)
      });

    }).catch(err => {
      this.toast.showFailure(err);
    })
  },

  /**
   * 切换视角
   */
  changeVisual: function(e) {
    let visual = e.currentTarget.dataset.type;
    let my = (visual == "my");

    if (this.data.myVisual == my) {
      return ;
    }

    this.setData({
      myVisual: my,
      lists: [],
      page: 0,
      noMore: false
    });

    this.loadData();
  },

  /**
   * 详情
   */
  detail: function(e) {
    let item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/square/detail/detail?item=' + item
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      page: 0,
      noMore: false,
    });

    this.loadData();
  },

  /**
   * 上滑加载更多
   */
  onReachBottom: function(){
    this.loadData();
  },

  onPageScroll: function(e) {
    if (e.scrollTop <= app.globalData.headerHeight) {
      this.nav.hide();
    } else {
      this.nav.show();
    }
  },
  
})