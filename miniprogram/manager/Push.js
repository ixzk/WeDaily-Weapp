/**
 * 通知封装
 * @param form_id       表单ID
 * @param time          上传时间
 * @param statuas       formID状态: 0表示可用， 1表示已使用
 */
import db from "../util/db.js";
import config from "../util/config.js";

const collection = "FormID";

/**
 * 发送模板消息
 * @param form_id 表单ID
 */
const push = (toUser, title, content, more) => {
    return new Promise((resolve, reject) => {
        const _ = db.command;

        const startDate = new Date((new Date).getTime() - 144*60*60*1000);

        db.select(collection, {
            _openid: toUser,
            status: 0,
            time: _.gte(startDate)
        }, 1).then(res => {
            console.log(res);
            if (res != null && res.length > 0) {
                // form_id, toUser, title, content, more
                wx.cloud.callFunction({
                    name: 'push',
                    data: {
                        _id: res[0]._id,
                        form_id: res[0].form_id,
                        toUser: toUser,
                        title: title,
                        content: content,
                        more: more
                    }
                }).then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
                resolve();
            } else {
                reject();
            }
        }).catch((code, msg) => {
            console.log(code, msg);
            reject(); 
        });
    });
}

const _push = (form_id, toUser, title, content, more) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.APP_ID + '&secret=' + config.APP_SECRET,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                let token = res.data.access_token;

                wx.request({
                    url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        access_token: token,
                        touser: toUser,
                        template_id: "6b0n63JkUvRj5JXOTeq3gFoYpDbdleiTJtwD21zmmXo",
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
                    },
                    success: function(res) {
                        console.log(res);
                        resolve(res);
                    },
                    fail: function(res) {
                        console.log(res);
                        reject("服务器开小差啦");
                    }
                })
            },
            fail: function(err, code) {
                console.log(err, code);
                reject("服务器开小差啦");
            }
        });
    });
}

/**
 * 上传formIds
 */
const upload = (data) => {
    return new Promise((resolve, reject) => {
        db.add(collection, {
            form_id: data,
            time: new Date(),
            status: 0
        }).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            console.log(code, msg);
            reject("服务器开小差啦");
        });
    });
}

module.exports = {
    push: push,
    upload: upload
}