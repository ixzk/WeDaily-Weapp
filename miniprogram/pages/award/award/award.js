// pages/award/award.js
import Award from "../../../manager/Award";
import Habit from "../../../manager/Habit";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: app.text.award.award,
    headerHeight: app.globalData.navHeight + 20,

    userInfo: app.globalData.userInfo,
    partnerInfo: app.globalData.partnerInfo,

    ongoing: true,     // 当前视角 true是正在进行，false是已处理
    page: 0,
    lists: [],         // 奖励列表
  },

  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      partnerInfo: app.globalData.partnerInfo
    });

    this.loadData();

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        page: this
      });
    }
  },

  onLoad: function(options) {
    this.toast = this.selectComponent("#toast");
  },

  /**
   * 加载奖励
   */
  loadData: function() {
    this.toast.showLoading();
    Award.lists(this.data.userInfo._openid, this.data.page, (this.data.partnerInfo ? this.data.partnerInfo._openid : null), !this.data.ongoing).then(res => {
      wx.stopPullDownRefresh();
      let lists = (this.data.page == 0 ? [] : this.data.lists);

      let finish = 0;
      res.forEach((item, index) => {
        let habit = app.globalData.habits[item.habit_id];
        
        if (habit) {
          if (item.isTime) {
            let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
            let day = 24 * 3600 * 1000;
            item.lastTime = parseInt( (habit.end_time.getTime() + day - time) / day );
          } else {
            item.lastCount = item.last_count - (habit.times - item.current_count);
          }

          item.habit = habit;

          lists.push(item);
          finish++;
        } else {
          Habit.detail(item.habit_id).then(habit => {

            if (habit != null) {
              if (item.isTime) {
                let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
                let day = 24 * 3600 * 1000;
                item.lastTime = parseInt( (habit.end_time.getTime() + day - time) / day );
              } else {
                item.lastCount = item.last_count - (habit.times - item.current_count);
              }
  
              item.habit = habit;
  
              lists.push(item);
            }
            
            finish++;
            
            if (finish == res.length) {
              this.toast.hideLoading();
              this.setData({
                lists: lists,
              });
            }

          }).catch(err => {
            this.toast.showFailure(err);
          });
        }
      });

      if (finish == res.length) {
        this.toast.hideLoading();
        this.setData({
          lists: lists,
        });
      }

      this.setData({
        page: this.data.page + 1
      });

    }).catch(err => {    
      console.log(err);  
      this.toast.showFailure(err);
    });
  },

  /**
   * 切换视角
   */
  changeVisual: function(e) {
    let visual = e.currentTarget.dataset.type;
    let ongoing = (visual == "ongoing");

    if (this.data.ongoing == ongoing) {
      return ;
    }

    this.setData({
      ongoing: ongoing,
      page: 0,
    });

    this.loadData()
  },

  /**
   * 查看奖励
   */
  clickAward: function(e) {
    if (!this.data.ongoing) {
      return ;
    }

    let index = e.currentTarget.dataset.index;
    let award = this.data.lists[index];

    let url = '/pages/calendar/calendar?habit_id=' + award.habit._id + '&type=award&time=' + (award.lastTime ? award.lastTime : -1) + '&count=' + (award.lastCount ? award.lastCount : -1) + '&award=' + JSON.stringify(award);
    
    wx.navigateTo({
      url: url
    });
  },

  /**
   * 添加
   */
  add: function() {
    wx.navigateTo({
      url: '/pages/award/add/add'
    });
  },
  
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function(){
    this.setData({
      page: 0
    });

    this.loadData();
  },

  /**
   * 上滑加载更多
   */
  onReachBottom: function(){
    this.loadData();
  },
})