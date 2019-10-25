// pages/square/detail/detail.js
import Article from "../../../manager/Article";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: app.text.square.detail,
    headerHeight: app.globalData.navHeight + 20,

    item: null,
    delete: false,

    userInfo: app.globalData.userInfo,
    partnerInfo: app.globalData.partnerInfo,

    partnerAddTip: false,
    partnerContent: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.toast = this.selectComponent("#toast");

    let jsonStr = options.item;
    let _id = options._id;
    if (jsonStr == null && _id == null) {
      this.toast.showFailure("非法请求");
      
      wx.navigateBack();
    } else {
      if (_id) {
        this.toast.showLoading();
        Article.find(_id).then(res => {
          this.toast.hideLoading();

          res.formatTimeFull = app.util.formatTime(res.time, true, false);

          this.setData({
            item: res,
          });

        }).catch(err => {
          this.toast.showFailure(err);
        });
      } else {
        let item = JSON.parse(jsonStr);
      
        this.setData({
          item: item,
          delete: (item._openid == this.data.userInfo._openid)
        });
      }
    }
  },

  /**
   * 删除文章
   */
  del: function() {
    let that = this;

    wx.showModal({
      title: '确定要删除嘛',
      content: '删除就不可恢复啦',
      success: function(res) {
        if (res.confirm) {          
          Article.del(that.data.item._id).then(res => {
            that.toast.showSuccess("删除成功");
            
            let pages = getCurrentPages();
            let prePage = pages[pages.length - 2];

            prePage.setData({
              page: 0,
              noMore: false,
            });
        
            prePage.loadData();

            wx.navigateBack();

          }).catch(err => { 
            this.toast.showFailure(err);
          });   
        }
      }
    });
  },

  /**
   * 伙伴点击添加内容
   */
  partnerAdd: function() {
    this.setData({
      partnerAddTip: true
    });
  },

  /**
   * 点击modal空白区域
   */
  modalClose: function() {
    this.setData({
      partnerAddTip: false
    });
  },

  /**
   * 发布评论
   */
  modalClick: function() {
    this.setData({
      partnerAddTip: false
    });

    if (this.data.partnerContent == "") {
      this.showWarning("还没填写内容呢");

      return ;
    }

    this.toast.showLoading();
    console.log(this.data.item._id);
    
    Article.update(this.data.item._id, {
      partner_avatar: this.data.userInfo.avatar,
      partner_content: this.data.partnerContent,
      partner_time: new Date()
    }).then(res => {
      console.log(res);
      
      this.toast.showSuccess("评论成功");
      
      this.setData({
        'item.partner_avatar': this.data.userInfo.avatar,
        'item.partner_content': this.data.partnerContent
      });

    }).catch(err => {
      this.toast.showFailure(err);
    });
  },

  /**
   * 内容输入
   */
  contentInput: function(e) {
    this.setData({
      partnerContent: e.detail.value
    });
  },

  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.item.content,
      path: '/pages/square/detail/detail?_id=' + this.data.item._id
    };
  }
})