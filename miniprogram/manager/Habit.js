/**
 * 习惯
 * @param title         习惯名称
 * @param icon          图标
 * @param weekday       每周哪一天需要打卡
 * @param create_time   创建时间
 * @param end_time      结束时间
 * @param share         是否共享
 * @param times         打卡次数
 * @param status        状态(0 正常，-1已删除, 1已完成)
 */

import db from "../util/db.js";

const collection = "Habit";

/**
 * 加载全部数据
 */
const loadAll = (open_id, partner_id = null) => {
    const _ = db.command;

    return new Promise((resolve, reject) => {
        let map = {
            _openid: (partner_id == null ? open_id : _.in([open_id, partner_id])),
            status: 0,
        }

        db.select(collection, map, 20).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject("服务器开小差啦");
        });
    });
}

/**
 * 加载全部数据
 */
const loadToday = (open_id, partner_id = null) => {
    let today = (new Date()).getDay();
    // 周日转换
    if (today == 0) {
        today = 7;
    }

    let start = 1 << (today - 1);
    // let end = 0;
    // for (let i = 0; i < 7; i++) {
    //     if (i == today) {
    //         continue;
    //     }
    //     end += (1 << i);
    // }

    // console.log(today, start, end);
    
    let time = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let end_time = new Date(time); 

    return new Promise((resolve, reject) => {
        let _ = db.command;

        let map = {
            _openid: (partner_id == null ? open_id : _.in([open_id, partner_id])),
            status: 0,
            end_time: _.gte(end_time).or(_.eq(null)),
            weekday: _.gte(start)
        }

        db.select(collection, map, 20, ('_id', 'asc')).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject("服务器开小差啦");
        });
    });
}

/**
 * 添加习惯
 */
const add = (data) => {
    return new Promise((resolve, reject) => {
        db.add(collection, {
            title: data.title,
            icon:  data.icon,
            weekday: data.weekday,
            create_time: new Date(),
            end_time: (data.end_time == null ? null : new Date(data.end_time)),
            share: data.share,
            times: 0,
            status: 0
        }).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject("添加失败");
        })     
    });
}

/**
 * 删除习惯
 */
const del = (_id) => {
    return new Promise((resolve, reject) => {
        db.del(collection, _id).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject("删除失败");
        });
    });
}

/**
 * 习惯数量
 */
const count = (open_id) => {
    return new Promise((resolve, reject) => {
        db.count(collection, {
            _openid: open_id
        }).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            resolve(0);
        });
    });
}

/**
 * 获取习惯的详情
 */
const detail = (_id) => {
    return new Promise((resolve, reject) => {
        db.find(collection, _id).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            resolve(null);
        });
    });
}

/**
 * 更新习惯
 */
const update = (_id, data) => {
    return new Promise((resolve, reject) => {
        db.update(collection, _id, data).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject("服务器开小差啦");
        });
    });
}

module.exports = {
    loadAll: loadAll,
    loadToday: loadToday,
    add: add,
    del: del,
    count: count,
    detail: detail,
    update: update
}