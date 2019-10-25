// pages/index/index.js
import Habit from "../../manager/Habit.js";
import Record from "../../manager/Record.js";
import User from "../../manager/User.js";
import Push from "../../manager/Push.js";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iPhoneX: false,
    userInfo: null,
    partnerInfo: null,
    partner: false,
    page: 0,
    lists: [],
    my_lists: [],
    my_finish_num: 0,
    my_amount_num: 0,
    partner_lists: [],
    partner_finish_num: 0,
    partner_amount_num: 0,
    tixing: false,
    currentHabit: null,
    text: app.text.index,
    myVisual: true,     // 当前视角 true是我，false是小伙伴
    
    showTodayTip: false,  // 显示今日欢迎语
    nowHour: 0,           // 当前时间

    invitePartner: false
  },

  onShow: function () {

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        page: this
      });
    }

    if (app.globalData.needReloadData) {
      app.globalData.needReloadData = false;
      this.setData({
        page: 0
      });

      this.loadData();
    }

    this.setData({
      invitePartner: wx.getStorageSync('invite') || false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.toast = this.selectComponent("#toast");

    // iPhoneX
    this.setData({
      iPhoneX: app.globalData.iPhoneX,
    });

    // 登录态
    if (app.globalData.userInfo == null || app.globalData.userInfo == "") {
      wx.redirectTo({
        url: '/pages/loginV2/login',
      });

      return ;
    }

    // 用户信息
    this.setData({
      userInfo: app.globalData.userInfo,
      partnerInfo: app.globalData.partnerInfo,
      partner: (app.globalData.partnerInfo == null ? false : true),
    });

    // 加载数据
    this.loadData();

    // 加载伙伴数据
    if (app.globalData.needReloadPartner) {
      this.loadPartner();
    }
  },

  /**
   * 今日提示框
   */
  showTodayTip: function() {
    let last = wx.getStorageSync('welcome');
    if (last != null) {
      let temp = last.split(" ");
      if (temp.length > 0) {
        last = temp[0];
      }
    }
    let today = app.util.formatTime(new Date(), true, false);
    today = today.split(" ");
    today = today[0];

    wx.setStorageSync('welcome', today);

    let show = (last != today);
    this.setData({
      showTodayTip: show,
      nowHour: (new Date()).getHours()
    });

  },

  /**
   * 获取今天的习惯
   */
  loadData: function() {
    this.toast.showLoading();
    Habit.loadToday(app.globalData.userInfo._openid, (this.data.partnerInfo == null ? null : this.data.partnerInfo._openid)).then(habits => {
      Record.today(app.globalData.userInfo._openid, (this.data.partnerInfo == null ? null : this.data.partnerInfo._openid)).then(records => {
        this.toast.hideLoading();
        wx.stopPullDownRefresh();
        this.showTodayTip();
        
        let finish_id = new Array();
        records.forEach((record, index) => {
          finish_id.push(record.habit_id);
        });

        let my_finish_num = 0;
        let my_amount_num = 0;
        let partner_finish_num = 0;
        let partner_amount_num = 0;
        let resData = [[], []];
        let app_habits = {};  // 留一份到app.js
        habits.forEach((habit, index) => {
          app_habits[habit._id] = habit;

          let id_index = finish_id.indexOf(habit._id);
          if (id_index != -1) {
            // 已完成
            habit.finish_id = records[id_index]._id;
            habit.finish = true;
            habit.finish_time = records[id_index].time
            if (habit._openid == this.data.userInfo._openid) {
              my_finish_num++;
            } else {
              partner_finish_num++;
            }
          } else {
            // 未完成
            habit.finish_id = ""
            habit.finish = false;
          }

          if (this.data.partnerInfo == null) {
            // 单人
            if (habit._openid == this.data.userInfo._openid) {
              // 本人
              my_amount_num++;
              resData[0].push(habit);
            }
          } else {
            // 两人
            if (habit._openid == this.data.userInfo._openid) {
              // 本人
              my_amount_num++;
              resData[0].push(habit);
            } else {
              // mango
              partner_amount_num++;
              resData[1].push(habit);
            }
          }
        });        
        
        this.setData({
          lists: this.data.myVisual ? resData[0] : resData[1],

          my_lists: resData[0],
          my_amount_num: my_amount_num,
          my_finish_num: my_finish_num,

          partner_lists: resData[1],
          partner_amount_num: partner_amount_num,
          partner_finish_num: partner_finish_num
        });

        app.globalData.habits = app_habits;

      }).catch(err => {
        this.toast.showFailure(err);
      });
    }).catch(err => {      
      this.toast.showFailure(err);
    });
  },

  /**
   * 刷新小伙伴信息
   */
  loadPartner: function() {
    User.myPartner(app.globalData.userInfo._openid).then(res => {
      let lastPartnerInfo = app.globalData.partnerInfo;
      if (lastPartnerInfo == null && res != null) {
        // 最新绑定小伙伴
        this.toast.showLoading(this.data.text.newPartner);
        setTimeout(() => {
          this.toast.hideLoading();
          // 重新加载数据
          this.loadData();
        }, 1500);
      } else if (lastPartnerInfo != null && res == null) {
        // 小伙伴解除
        this.toast.showFailure(this.data.text.relievePartner);
      } else if (lastPartnerInfo != null && res != null &&  lastPartnerInfo._openid != res._openid) {
        this.toast.showSuccess(this.data.text.refreshPartner);
      }

      app.globalData.partnerInfo = res;
      wx.setStorageSync('partnerInfo', res);

      this.setData({
        partnerInfo: res,
        partner: (res == null ? false : true)
      });

    }).catch(err => {      
      this.toast.showFailure(err);
    });
  },

  /**
   * 打卡
   */
  finishHabit: function(e) {
    let habitId = e.currentTarget.dataset.habitid;
    let index = e.currentTarget.dataset.index;
    
    this.toast.showLoading();
    Record.finish(habitId).then(res => {
      this.toast.showSuccess(this.data.text.finishCard);
      let my_lists = this.data.my_lists;
      if (this.data.partner) {
        my_lists[index].finish = true;
        my_lists[index].finish_id = res._id._id;
        my_lists[index].times = my_lists[index].times + 1;
      } else {
        my_lists[index].finish = true;
        my_lists[index].finish_id = res._id._id;
        my_lists[index].times = my_lists[index].times + 1;
      }

      app.globalData.habits[my_lists[index]._id].times = my_lists[index].times;

      this.setData({
        lists: my_lists,
        my_lists: my_lists,
        my_finish_num: this.data.my_finish_num + 1
      });

    }).catch(err => {
      this.toast.showFailure(err);
    });
  },

  /**
   * 取消打卡
   */
  cancelHabit: function(e) {
    let _id = e.currentTarget.dataset.finishid;
    let habitId = e.currentTarget.dataset.habitid;
    let index = e.currentTarget.dataset.index;

    let that = this;
    let text = this.data.text;
    wx.showModal({
      title: text.cancelTitle,
      content: text.cancelContent,
      showCancel: true,
      success(res) {
        if (res.confirm) {
          that.toast.showLoading();
          let my_lists = that.data.my_lists;
          Record.cancel(_id, habitId, my_lists[index].times).then(res => {
            if (that.data.partner) {
              my_lists[index].finish = false;
              my_lists[index].finish_id = "";
              my_lists[index].times = (my_lists[index].times > 0 ? my_lists[index].times - 1 : 0);
            } else {
              my_lists[index].finish = false;
              my_lists[index].finish_id = "";
              my_lists[index].times = (my_lists[index].times > 0 ? my_lists[index].times - 1 : 0);
            }

            app.globalData.habits[my_lists[index]._id].times = my_lists[index].times;

            that.setData({
              lists: my_lists,
              my_lists: my_lists,
              my_finish_num: that.data.my_finish_num - 1
            });

            that.toast.showSuccess(text.cancelCard);
          }).catch(err => {
            that.toast.showFailure(err);
          });
        }
      }
    })
  },

  /**
   * 点击对方打卡
   */
  partnerHabit: function(e) {
    let index = e.currentTarget.dataset.index;
    let habit = this.data.partner_lists[index];

    let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let day = 24 * 3600 * 1000;
    habit.lastday = (habit.end_time == null ? "∞" : parseInt( (habit.end_time.getTime() + day - time) / day ) );
    
    if (habit.finish) {
      wx.showModal({
        title: habit.title,
        content: '打卡时间: ' + app.util.formatTime(habit.finish_time, true, false),
        cancelText: '好的',
        confirmText: '查看详情',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/calendar/calendar?habit_id=' + habit._id
            });
          }
        }
      });
    } else {
      let that = this;

      wx.showModal({
        title: '提醒对方打开',
        content: '快来提醒小伙伴打开叭！',
        success: function(res) {
          if (res.confirm) {
            that.toast.showLoading();
            let more = (habit.lastday >= 0 && habit.lastday != '∞' ? "还剩" + habit.lastday + "天！" : "已打卡" + habit.times + "次！");
            Push.push(that.data.partnerInfo._openid, habit.title, "醒醒，你该打卡啦", more).then(() => {
              that.toast.hideLoading();
              wx.showModal({
                title: '已发送',
                content: '小可爱的督促已经送达 ^.^',
                showCancel: false
              });
            }).catch((res) => {
              console.log(res);
              that.toast.hideLoading();
              that.setData({
                tixing: true,
                currentHabit: habit
              });
            });
          }
        }
      });
    }
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
   * 转发监听
   */
  onShareAppMessage: function(options) {

    this.setData({
      tixing: false
    });

    return {
      title: '该打卡啦 ' + '[ ' + this.data.currentHabit.title + ' ]',
      path: '/pages/indexV2/index',
      imageUrl: '/images/card.png'
    }
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
      lists: []
    });

    this.setData({
      lists: (my ? this.data.my_lists : this.data.partner_lists)
    });
  },

  /**
   * 刷新伙伴关系
   */
  refresh: function() {
    wx.reLaunch({
      url: '/pages/indexV2/index',
    });
      
  },

  /**
   * 点击今日提醒按钮
   */
  modalClick: function(e) {
    this.setData({
      showTodayTip: false
    });
  },

  addHabit: function() {
    wx.navigateTo({
      url: '/pages/add/add',
    })
  }
})