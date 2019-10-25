// pages/square/add/add.js
import Article from '../../../manager/Article.js';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: app.text.square.add,
    headerHeight: app.globalData.navHeight,
    currentTime: app.util.formatTime(new Date(), false, false),

    share: 0,
    share_partner: false,
    content: "",
    image: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toast = this.selectComponent("#toast");
  },

  /**
   * 选择图片
   */
  chooseImage: function() {
    let that = this;
    wx.chooseImage({
      count: 1,	
      sizeType: ['compressed'],	// 压缩图
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          image: res.tempFilePaths[0]
        });
      }
    })
  },

  /**
   * 选择分享限度
   */
  selectShare: function(e) {
    let type = e.currentTarget.dataset.type;
    let share = e.currentTarget.dataset.share;    
  
    this.setData({
      share: type,
      share_partner: Boolean(share)
    });
  },

  /**
   * 正文输入
   */
  contentInput: function(e) {
    let value = e.detail.value;
    this.setData({
      content: value
    });
  },

  /**
   * 完成
   */
  finish: function() {
    if (this.data.content.length == 0) {
      this.toast.showWarning("啥都没写呢!");
      return ;
    } else {
      this.toast.showLoading();

      let filePath = this.data.image;
      if (filePath == null) {
        this.publish(null);
      } else {
        let name = Math.random() * 1000000;
        let cloudPath = name + filePath.match(/\.[^.]+?$/)[0];

        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: filePath,
        }).then(res => {
          this.publish(res.fileID);
        }).catch(err => {
          this.toast.showFailure("图片上传失败");
        });
      }
    }
  },

  /**
   * 发布核心
   */
  publish: function(fileID) {
    let userInfo = app.globalData.userInfo;
    let data = {
      avatar: userInfo.avatar,
      image: fileID,
      content: this.data.content,
      share: parseInt(this.data.share),
      share_partner: this.data.share_partner
    };

    Article.add(data).then(res => {
      this.toast.showSuccess("发布成功");
      
      let pages = getCurrentPages();
      let prePage = pages[ pages.length - 2 ];

      prePage.setData({
        page: 0,
        noMore: false,
      });
      prePage.loadData();

      wx.navigateBack({
          delta: 1
      });
    }).catch(err => {
      this.toast.showFailure(err);
    });
  }
})