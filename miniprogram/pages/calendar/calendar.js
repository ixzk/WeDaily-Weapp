import Record from "../../manager/Record";
import Award from "../../manager/Award";

const app = getApp();

Page({

  data: {
    headerHeight: app.globalData.navHeight,
    text: app.text.calendar,
    userInfo: app.globalData.userInfo,

    monthStr: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    month: 0,
    days: [],
    monthStart: -1,

    habit: null,
    habit_id: null,
    award: null,

    type: null,

    last_type: null,
    last_num: 0
  },

  onShow: function() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },

  onLoad: function(options) {
    this.toast = this.selectComponent("#toast");

    let award = (options.award ? JSON.parse(options.award) : null);
    
    if (award) {
      award.formatTime = app.util.formatTime(award.create_time)
    }

    this.setData({
      habit_id: options.habit_id,
      type: (options.type ? options.type : null),
      habit: (award ? award.habit : null),
      award: award,

      last_type: (options.time == -1 ? 'count' : 'time'),
      last_num: (options.time == -1 ? options.count : options.time),
    });

    this.initCalendar();
  },

  /**
   * 日历初始化
   */
  initCalendar: function() {
    let date = new Date();
    let _month = date.getMonth();

    this.setData({
      month: date.getMonth()
    })

    this.loadDay();
  },

  /**
   * 加载本月天数
   */
  loadDay: function() {
    let date = new Date();
    let _year = date.getFullYear();
    let _month = this.data.month;

    let days = [];

    let _firstDay = new Date(_year, _month, 1);
    for(let i = 0;i < 6 * 7;i++){
      var _thisDay = new Date(_year, _month, i + 1 - _firstDay.getDay());
      var _thisDayStr = this.getDateStr(_thisDay);

      if ( _thisDay.getDate() == 1 && this.data.monthStart == -1) {
        this.setData({
          monthStart: i
        });
      }
      
      days.push({
        day: _thisDay.getDate(),
        on: false,
        onStyle: ''
      });

      if(_thisDayStr == this.getDateStr(new Date())) {    // 当前天
        days[i].className = 'currentDay';
      }else if(_thisDayStr.substr(0, 6) == this.getDateStr(_firstDay).substr(0, 6)) {
        days[i].className = 'currentMonth';  // 当前月  

      }else {    // 其他月
        days[i].className = 'otherMonth';
      }
    }

    this.setData({
      days: days
    });

    this.loadData();
  },

  /**
   * 改变月份
   */
  changeMonth: function(e) {
    let type = e.currentTarget.dataset.type;

    let month = this.data.month;
    if (type == "down") {
      month = (month == 0 ? 11 : month - 1);
    } else {
      month = (month == 11 ? 0 : month + 1);
    }

    this.setData({
      month: month,
      monthStart: -1
    });

    this.loadDay();
  },

  /**
   * 加载网络数据
   */
  loadData: function() {
    this.toast.showLoading();
    
    console.log(this.data.month);
    
    Record.month(this.data.habit_id, this.data.month).then(res => {
      this.toast.hideLoading();
      
      let days = this.data.days;        
      let award = this.data.award;

      for (let i = 0;i < res.length;i++) {
        let item = res[i];
        if (award) {
          // 来自奖励
          if (item.time.getTime() < (new Date(award.create_time)).getTime()) { 
            continue;
          }
        }
        
        let day = item.time.getDate();
        days[day + this.data.monthStart - 1].on = true;
      }

      for (let i = 0;i < days.length;i++) {
        // 连续性判断
        if (days[i].on == true) {
          if (i == 0 || !days[i - 1].on) {
            days[i].onStyle = "onNormal onLeft";
          } else {
            days[i].onStyle = "onNormal";
          }
        } else {
          if (i > 0 && !days[i].on) {
            if (days[i-1].on) {              
              if (days[i-1].onStyle == "onNormal") {
                days[i-1].onStyle += " onRight";
              } else if (days[i-1].onStyle == "onNormal onLeft") {
                days[i-1].onStyle = "onNormal onSingle";
              }
            }
          }
        }
      }

      this.setData({
        days: days
      });
      

    }).catch(err => {
      console.log(err);
      
      this.toast.showFailure(err);
    });
  },

  /**
   * 编辑习惯
   */
  editHabit: function() {
    wx.navigateTo({
      url: '/pages/addV2/add?id=' + this.data.habit_id
    })
  },

  getDateStr: function(date) {
    var _year = date.getFullYear();
    var _month = date.getMonth() + 1;    // 月从0开始计数
    var _d = date.getDate();

    _month = (_month > 9) ? ("" + _month) : ("0" + _month);
    _d = (_d > 9) ? ("" + _d) : ("0" + _d);
    return _year + _month + _d;
  },

  /**
   * 完成
   */
  finish: function() {
    let _id = this.data.award._id;

    let title = "Finish!";
    let content = "";

    if (this.data.award.to_partner) {
      content = "快去奖励小伙伴吧 ~";
    } else {
      content = "快去奖励自己吧 ~";
    }

    let that = this;
    wx.showModal({
      title: title,
      content: content,
      success: function(res) {
        if (res.confirm) {
          that.toast.showLoading();
          Award.update(_id, {
            finish: 1
          }).then(res => {
            that.toast.showSuccess();

            let pages = getCurrentPages();
            let prePage = pages[ pages.length - 2 ];
            prePage.setData({
              page: 0,
            });
            prePage.loadData();

            wx.navigateBack({});
          }).catch(err => {
            that.toast.showFailure(err);
          });
        } 
      }
    });
  },

  /**
   * 删除奖励
   */
  delete: function() {
    let _id = this.data.award._id;

    let title = "";
    let content = "";

    if (this.data.award.to_partner) {
      title = "和小伙伴沟通清楚哦";
      content = "删除之后小伙伴就看不到奖励啦";
    } else {
      title = "确定删除嘛";
      content = "删除之后就看不到奖励啦";
    }

    let that = this;
    wx.showModal({
      title: title,
      content: content,
      success: function(res) {
        if (res.confirm) {
          that.toast.showLoading();
          Award.del(_id).then(res => {
            that.toast.showSuccess("删除成功");

            let pages = getCurrentPages();
            let prePage = pages[ pages.length - 2 ];
            prePage.setData({
              page: 0,
            });
            prePage.loadData();

            wx.navigateBack({});
          }).catch(err => {
            that.toast.showFailure(err);
          });
        } 
      }
    });
  }
})