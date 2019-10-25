/**
 * 用户表
 * @param nickname      昵称
 * @param avatar        头像
 * @param sex           性别 (男1女2)
 * @param register_time 注册时间
 */
import db from "../util/db.js";
import Partner from "./Partner.js";

const collection = "User";

/**
 * 登录
 */
const login = data => {
    return new Promise((resolve, reject) => {
        let _openid = data._openid;
        db.select(collection, {
            _openid: _openid
        }).then(res => {
            if (res && res.length > 0) {
                // 登录成功
                let userInfo = res[0];
                myPartner(_openid).then(res => {
                    resolve({
                        userInfo: userInfo,
                        partnerInfo: res
                    });
                }).catch(err => {
                    reject(err);
                })
            } else {
                // register
                _create(data).then(res => {
                    resolve(data);
                }).catch((code, msg) => {
                    reject("注册失败");
                });
            }
        }).catch((code, msg) => {
            console.log(code, msg);
            reject("登录失败");
        });
    });
}

/// private

/**
 * 添加用户
 */
const _create = data => {
    Partner.bind(data._openid, null);
    return db.add(collection, {
        nickname: data.nickName,
        avatar: data.avatarUrl,
        sex: data.gender,
        register_time: new Date()
    });
}

/**
 * 我的伙伴
 */
const myPartner = (open_id) => {
    return new Promise((resolve, reject) => {
        Partner.myPartner(open_id).then(res => {
            if (res == null) {
                resolve(null);
            } else {
                findUser(res.partner_id).then(user => {
                    user.bind_time = res.bind_time;
                    resolve(user);

                }).catch(err => {
                    reject(err);
                });
            }
        }).catch(err => {
            reject(err);
        })
    });
}

/**
 * 查找用户信息
 */
const findUser = (open_id) => {
    return new Promise((resolve, reject) => {
        db.select(collection, {
            _openid: open_id
        }, 10).then(res => {
            if (res.length == 0) {
                reject("小伙伴失踪啦");
            } else {
                resolve(res[0]);
            }
        }).catch(err => {
            reject("小伙伴失踪啦");
        });
    });
}

module.exports = {
  collection: collection,
  login: login,
  myPartner: myPartner,
  findUser: findUser
}