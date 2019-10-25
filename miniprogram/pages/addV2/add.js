// pages/add/add.js
import Habit from "../../manager/Habit.js"

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerHeight: app.globalData.navHeight + 20,
    iPhoneX: false,
    icon: [],
    weekday: ["一", "二", "三", "四", "五", "六", "日"],
    weekday_bool: [true, true, true, true, true, true, true],
    date: null,

    title: "",
    selected_icon: 1,
    selected_weekday: 0,
    end_time: null,
    share: false,

    // 编辑
    edit_id: null,
    text: app.text.add,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let icon = [];
    for(let i = 0;i < 2;i++){
      icon[i] = [];
      for (let j = 1;j <= 24;j++) {
        icon[i].push((i * 24) + j);
      }
    }

    let selected_weekday = 0;
    for (let i = 0;i < 7;i++) {
      selected_weekday += (1 << i);
    }    

    this.setData({
      iPhoneX: app.globalData.iPhoneX,
      icon: icon,
      selected_weekday: selected_weekday
    });

    this.toast = this.selectComponent("#toast");

    if (options.id != null) {
      this.setData({
        edit_id: options.id
      });

      this.loadHabit();

      return ;  
    }

    this.habitAmount();
  },

  /**
   * 习惯名字
   */
  nameInput: function(e) {
    let value = e.detail.value
    
    if (value.length >= 10) {
      wx.showToast({
        title: this.data.text.nameLength,
        icon: 'none'
      })
    }
    
    this.setData({
      title: value
    });
  },

  /**
   * 选择icon
   */
  selectIcon: function(e) {
    this.setData({
      selected_icon: e.currentTarget.dataset.id
    });
  },

  /**
   * 选择每周的第几天
   */
  selectDay: function(e){
    let index = parseInt(e.currentTarget.dataset.index);    
    let offset = parseInt(e.currentTarget.dataset.offset);
    
    let day_bool = this.data.weekday_bool;
    let selected_weekday = this.data.selected_weekday;

    offset *= (day_bool[index] ? -1 : 1);
    
    selected_weekday += offset;
    day_bool[index] = !day_bool[index];    

    this.setData({
      weekday_bool: day_bool,
      selected_weekday: selected_weekday
    });
  },

  /**
   * 是否共享
   */
  shareChange: function(e) {
    this.setData({
      share: e.detail.value
    });
  },

  /**
   * 选择截止日期
   */
  bindDateChange: function(e){
    console.log(e.detail.value);

    let time  = new Date(new Date().setHours(0, 0, 0, 0)).getTime();

    if ( (new Date(e.detail.value)).getTime() < time) {
      this.setData({
        date: app.util.formatTime(new Date(), false)
      });

      this.toast.showWarning(this.data.text.dateError);

      return ;
    }
    
    this.setData({
      date: e.detail.value,
      end_time: e.detail.value
    });
  },

  /**
   * save
   */
  save: function() {

    if (this.data.title.length == 0 || this.data.selected_weekday == 0) {
      this.toast.showWarning(this.data.text.saveError);
      return ;
    }

    let data = {
      title: this.data.title,
      icon: this.data.selected_icon,
      weekday: this.data.selected_weekday,
      end_time: this.data.end_time,
      share: this.data.share
    };

    this.toast.showLoading();
    if (this.data.edit_id) {
      data.end_time = (data.end_time == null ? null : new Date(data.end_time));
      Habit.update(this.data.edit_id, data).then(res => {
        this.toast.showSuccess();
        
        app.globalData.needReloadData = true;
  
        wx.switchTab({
          url: '/pages/mineV2/mine',
        });
      }).catch(err => {
        this.toast.showFailure(err)
      });
    } else {
      Habit.add(data).then(res => {
        this.toast.showSuccess();
        
        app.globalData.needReloadData = true;
        app.globalData.habitAmount = app.globalData.habitAmount + 1;
  
        wx.switchTab({
          url: '/pages/mineV2/mine',
        });
      }).catch(err => {
        this.toast.showFailure(err);
      });
    }

  },

  /**
   * 习惯数量获取
   */
  habitAmount: function(){
    let maxAmount = 20;

    if (app.globalData.habitAmount == -1) {
      this.toast.showLoading();
      Habit.count(app.globalData.userInfo._openid).then(res => {
        this.toast.hideLoading();
        
        app.globalData.habitAmount = res;
        if (res >= maxAmount) {
          wx.showModal({
            title: this.data.text.manyTitle,
            content: this.data.text.manyContent,
            showCancel: false,
            success: function(res) {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        } 

      }).catch(err => {
        this.toast.showFailure(app.text.sys.netError);
      });
    } else if (app.globalData.habitAmount >= maxAmount) {
      wx.showModal({
        title: this.data.text.manyTitle,
        content: this.data.text.manyContent,
        showCancel: false,
        success: function(res) {
          wx.navigateBack({
            delta: 1
          });
        }
      });
    }
  },

  /**
   * 编辑状态加载数据
   */
  loadHabit: function() {
    this.toast.showLoading();
    Habit.detail(this.data.edit_id).then(res => {
      this.toast.hideLoading();
      this.setData({
        title: res.title,
        selected_icon: res.icon,
        selected_weekday: res.weekday,
        weekday_bool: this.weekDayChange(res.weekday),
        date: (res.end_time == null ? null : app.util.formatTime(res.end_time, false)),
        end_time: res.end_time,
        share: res.share,
      });
    }).catch(err => {
      this.toast.showFailure(err);
    });
  },

  /**
   * 删除习惯
   */
  del: function() {
    let that = this;
    wx.showModal({
      title: this.data.text.delTitle,
      content: this.data.text.delContent,
      success: function(res) {
        if (res.confirm) {
          that.toast.showLoading();
          Habit.del(that.data.edit_id).then(res => {
            that.toast.showSuccess(that.data.text.delSuccess);

            app.globalData.needReloadData = true;
            app.globalData.habitAmount = app.globalData.habitAmount - 1;

            setTimeout(() => {
              wx.switchTab({
                url: '/pages/mineV2/mine',
              });
            }, 1000);
          }).catch(err => {
            that.toast.showFailure(err);
          });
        }
      }
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

})