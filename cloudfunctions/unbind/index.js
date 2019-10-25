// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();

const collection = "Partner";

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  const wxContext = cloud.getWXContext();

  const {partner_id} = event;

  return new Promise((resolve, reject) => {

  db.collection(collection)
          .where({
            _openid: partner_id
          })
          .get()
          .then(res => {
              res = res.data;
              db.collection(collection).doc(res[0]._id).update({
                data: {
                  partner_id: null,
                  remark: null,
                  bind_time: null
                }
              }).then(res => {
                  resolve("解绑完成");
              }).catch((code, msg) => {
                  reject("解绑失败");
              });

          }).catch( (code, msg) => {
            console.log(code, msg);
            reject("解绑失败");
          });
 });
})