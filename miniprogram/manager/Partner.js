/**
 * 双方关系绑定表
 * @param _openid       本人open_id (自带，无需处理)
 * @param partner_id    同伴open_id
 * @param remark        同伴的备注
 * @param bind_time     绑定时间
 */

import db from "../util/db.js"

const collection = "Partner";

/**
 * 加载关系
 * @param open_id      本人open_id
 */
const load = (open_id) => {
    return new Promise((resolve, reject) => {
        db.select(collection, {
            _openid: open_id
        }, 1).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject("小伙伴失踪啦");
        });
    });
}

/**
 * 绑定关系
 * @param open_id      本人open_id
 * @param partner_id   同伴open_id
 */
const bind = (open_id, partner_id) => {
    return new Promise((resolve, reject) => {
        db.select(collection, {
            _openid: open_id
        }).then(res => {
            if (res.length == 0) {
                _create(partner_id).then(res => {
                    wx.cloud.callFunction({
                        name: 'bind',
                        data: {
                            open_id: open_id,
                            partner_id: partner_id
                        }
                    }).then(res => {
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                    });
                    return ;
                }).catch((code, msg) => {
                    reject("注册失败-P");
                    return ;
                });
            }

            if (partner_id != null) {
                db.update(collection, res[0]._id, {
                    partner_id: partner_id,
                    bind_time: new Date()
                }).then(res => {
                    wx.cloud.callFunction({
                        name: 'bind',
                        data: {
                            open_id: open_id,
                            partner_id: partner_id
                        }
                    }).then(res => {
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                    });
                }).catch((code, msg) => {
                    reject("绑定失败");
                });
            }
        }).catch((code, msg) => {
            console.log(code, msg);
            reject("服务器开小差啦");
        });
    });
}

/**
 * 备注
 * @param _id          索引ID
 * @param name         备注昵称
 */
const remark = (_id, name) => {
    return new Promise((resolve, reject) => {
        db.update(collection, _id, {
            remark: name
        }).then(res => {
            resolve("修改备注成功");
        }).catch((code, msg) => {
            reject("小伙伴失踪啦");
        });
    });
}

/**
 * 解绑
 */
const unbind = (open_id, partner_id) => {
    return new Promise((resolve, reject) => {
       load(open_id).then(res => {
            db.update(collection, res._id, {
                partner_id: null,
                remark: null,
                bind_time: null
            }).then(res => {
                wx.cloud.callFunction({
                    name: 'unbind',
                    data: {
                        partner_id: partner_id
                    }
                }).then(res => {
                    resolve("解绑完成");
                }).catch(err => {
                    reject("解绑失败");
                });
            }).catch((code, msg) => {
                reject("解绑失败");
            });
       }).catch(err => {
            reject("解绑失败");
       });
    });
}

/**
 * 我的伙伴
 */
const myPartner = (open_id) => {
    return new Promise((resolve, reject) => {
        db.select(collection, {
            _openid: open_id
        }, 1).then(res => {            
            if (res.length == 0 || res[0].partner_id == null) {
                // // 反向查询
                // db.select(collection, {
                //     partner_id: open_id
                // }, 1).then(res => {
                //     if (res.length == 0) {
                //         resolve(null);
                //     } else {
                //         resolve(res[0]);
                //     }
                // }).catch(err => {
                //     reject("小伙伴失踪啦");
                // });

                resolve(null);

            } else {
                // 双向查询，保证被动的一方可以也可以刷新数据 (后续考虑云开发)
                // db.select(collection, {
                //     _openid: res[0]._openid
                // }, 1).then(res => {
                //     if (res.length == 0 || res[0].partner_id == null) {
                //         if (res.length != 0) {
                //             db.update(collection, res[0]._id, {
                //                 partner_id: null,
                //                 remark: null,
                //                 bind_time: null
                //             });
                //         }

                //         resolve(null);
                //     } else {
                //         resolve(res[0]);
                //     }
                // });

                resolve(res[0]);
            }
        }).catch((code, msg) => {
            reject("小伙伴失踪啦");
        });
    });
}

/// private 
const _create = (partner_id) => {
    return new Promise((resolve, reject) => {
        return db.add(collection, {
            partner_id: partner_id,
            remark: null,
            bind_time: (partner_id == null ? null : new Date())
        });
    });
}


/// exports
module.exports = {
    collection: collection,
    load: load,
    bind: bind,
    remark: remark,
    unbind: unbind,
    myPartner: myPartner
}

