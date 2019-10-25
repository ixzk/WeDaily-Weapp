// 云函数入口文件
const cloud = require('wx-server-sdk');
const axios = require('axios');


const APP_ID = "APP_ID";
const APP_SECRET = "APP_SECRET";

cloud.init();
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext()

  const {userInfo, _id, form_id, toUser, title, content, more} = event

  return new Promise((resolve, reject) => {
    axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APP_ID + '&secret=' + APP_SECRET).then(res => {
      // console.log(res);
      let token = res.data.access_token;
      // console.log(token);

      axios.post('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token, {
        access_token: token,
        touser: toUser,
        template_id: "template_id",
        page: "/page/indexV2/index",
        form_id: form_id,
        data: {
            "keyword1": {
                value: title
            },
            "keyword2": {
                value: content
            },
            "keyword3": {
                value: more
            }
        },
        emphasis_keyword: "keyword1.DATA"
      }).then(res => {
        db.collection("FormID").doc(_id).remove();
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });
})