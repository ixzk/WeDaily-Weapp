// pages/award/add/add.js
const app = getApp();

import Habit from '../../../manager/Habit';
import Award from '../../../manager/Award';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerHeight: app.globalData.navHeight + 20,
    text: app.text.award.add,

    userInfo: app.globalData.userInfo,
    partnerInfo: app.globalData.partnerInfo,

    myHabit: [],
    partnerHabit: [],
    dayHabit: false,  // 是否是天数类型的打卡任务
    lastDay: 0,
    times: [],   // 选择坚持次数
    time_index:0,

    title: "",
    content: "",
    habit_index: -1,
    to_partner: false,
    last_count: 30,  // 次数
  },

  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
      partnerInfo: app.globalData.partnerInfo
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast");

    let times = [];
    for (let i = 1;i < 365; i++){
      times.push(i);
    }

    times.push("一年有点长了哦");

    this.setData({
      times: times
    });

    this.loadData();
  },

  /**
   * 奖励给谁
   */
  toPartner: function(e) {
    let my = e.currentTarget.dataset.type;
    
    this.setData({
      to_partner: !(my == "my"),
      habit_index: -1,
    });
  },

  /**
   * 加载习惯
   */
  loadData: function() {
    this.toast.showLoading();
    Habit.loadAll(this.data.userInfo._openid, (this.data.partnerInfo ? this.data.partnerInfo._openid : null)).then(res => {
      this.toast.hideLoading();

      let myHabit = [];
      let partnerHabit = [];
      
      res.forEach((item, _) => {

        if (item.end_time == null || item.end_time >= new Date()) {
          if (item._openid == this.data.userInfo._openid) {
            myHabit.push(item);
          } else {
            partnerHabit.push(item);
          }
        }
      });

      this.setData({
        myHabit: myHabit,
        partnerHabit: partnerHabit
      });

    }).catch(err => {
      this.toast.showFailure(err);
    });
  },

  /**
   * 选择习惯
   */
  selectHabit: function(e) {
    let index = e.currentTarget.dataset.index;
    let habit = (this.data.to_partner ? this.data.partnerHabit[index] : this.data.myHabit[index]);

    let data = {
      habit_index: index,
    };

    let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let day = 24 * 3600 * 1000;

    if (habit.end_time) {
      data.dayHabit = true;
      data.lastDay = parseInt( (habit.end_time.getTime() + day - time) / day );
      data.last_count = 0;
    } else {
      data.dayHabit = false;
      data.lastDay = 0;
      data.last_count = 30;
    }

    this.setData(data);
  },

  /**
   * 选择次数
   */
  timePickerChange: function(e) {
    let time_index = e.detail.value;
    let data = this.data.times[time_index];

    if (time_index == this.data.times.length - 1) {
      time_index = this.data.times.length - 2;
      data = 364;
    }

    this.setData({
      time_index: time_index,
      last_count: data
    });
  },

  /**
   * 奖励输入
   */
  nameInput: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  /**
   * 内容输入
   */
  contentInput: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  /**
    * 保存
    * @param habit_id      习惯ID
    * @param habit_name    习惯名
    * @param title         奖励标题
    * @param content       奖励备注
    * @param avatar        头像
    * @param isTime        是否是按照时间来计算
    * @param deadline      截止时间
    * @param current_count 当前次数
    * @param last_count    剩余次数
    * @param finish        是否已经完成：0.未完成， 1.已放弃 2.已领取
    * @param to_partner    赠送给对方：false.否 true.是
    */
  save: function() {
    let index = this.data.habit_index;
    let habit = (this.data.to_partner ? this.data.partnerHabit[index] : this.data.myHabit[index]);

    if (this.data.habit_index == -1) {
      this.toast.showWarning("还没有选择习惯！");
      return ;
    }

    if (this.data.title.length == 0) {
      this.toast.showWarning("还没有填写奖励呢！");
      return ;
    }

    let data = {
      habit_id: habit._id,
      habit_name: habit.title,
      title: this.data.title,
      content: this.data.content,
      avatar: this.data.userInfo.avatar,
      isTime: this.data.dayHabit,
      deadline: habit.end_time,
      current_count: habit.times,
      last_count: this.data.last_count,
      finish: 0,
      to_partner: this.data.to_partner,
    };

    this.toast.showLoading();

    Award.add(data).then(res => {
      this.toast.hideLoading();
    }).catch(err => {
      this.toast.showFailure(err);
    });

    wx.navigateBack({});
  }

})