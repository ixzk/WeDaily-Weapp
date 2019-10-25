// pages/mineV2/mine.js
import Habit from "../../manager/Habit.js";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: app.globalData.theme,
    iPhoneX: false,
    userInfo: null,
    partnerInfo: null,
    partner: false,
    page: 0,
    lists: [],
    weekday: ["一", "二", "三", "四", "五", "六", "日"],

    animation: null,

    text: app.text.mine,
    sinceToday: 0,
    partnerTime: 0,
  },

  onShow: function() {

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
        page: this
      });
    }

    this.setData({
      page: 0,
    });

    this.loadData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nav = this.selectComponent("#nav");
    this.toast = this.selectComponent("#toast");

    this.setData({
      iPhoneX: app.globalData.iPhoneX
    });

    // 用户信息
    this.setData({
      userInfo: app.globalData.userInfo,
      partnerInfo: app.globalData.partnerInfo,
      partner: (app.globalData.partnerInfo == null ? false : true),
      sinceToday: app.util.sinceToday(app.globalData.userInfo.register_time),
      partnerTime: ( app.globalData.partnerInfo == null ? 0 : app.util.sinceToday(app.globalData.partnerInfo.bind_time) )
    });
  },

  /**
   * 加载数据
   */
  loadData: function() {
    this.toast.showLoading();
    Habit.loadAll(app.globalData.userInfo._openid, this.data.page).then(res => {
      this.toast.hideLoading();

      let today = new Date();
      let lists = (this.data.page == 0 ? [] : this.data.lists);

      let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
      let day = 24 * 3600 * 1000;

      res.forEach((value, _) => {
        value.weekday = this.weekDayChange(value.weekday);
        value.lastday = (value.end_time == null ? "∞" : parseInt( (value.end_time.getTime() + day - time) / day ) );
        lists.push(value);
      });

      console.log(res);

      this.setData({
        page: this.data.page + 1,
        lists: lists
      });
    }).catch(err => {
      console.log(err);
      this.toast.showFailure(err);
    });
  },

  /**
   * 每周相关转换
   */
  weekDayChange: function(number) {
    let array = [false, false, false, false, false, false, false];
    let index = 0;
    number = number.toString(2);
    for (let i = number.length - 1; i >= 0; i--) {
      array[index++] = (number[i] == 1);
    }

    return array;
  },

  /**
   * 上滑加载更多
   */
  // onReachBottom: function(){
  //   this.loadData();
  // },

  addHabit: function() {
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },

  onPageScroll: function(e) {
    if (e.scrollTop <= app.globalData.headerHeight) {
      this.nav.hide();
    } else {
      this.nav.show();
    }
  }
})