/**
 * 奖励管理工具
 * 
 * @param habit_id      习惯ID
 * @param habit_name    习惯名
 * @param title         奖励标题
 * @param content       奖励备注
 * @param avatar        头像
 * @param isTime        是否是按照时间来计算
 * @param deadline      截止时间
 * @param current_count 当前次数
 * @param last_count    剩余次数
 * @param finish        是否已经完成：0.未完成， 1. 完成
 * @param to_partner    赠送给对方：false.否 true.是
 * @param create_time   添加时间
 */


import db from "../util/db.js";
const collection = "Award";

/**
 * 添加奖励
 */
const add = (data) => {
    data.create_time = new Date();

    return new Promise((resolve, reject) => {
        db.add(collection, data).then(res => {
            resolve(res)
        }).catch((code, msg) => {
            reject(db.errMsg);
        });
    });
}

/**
 * 删除奖励
 */
const del = (_id) => {
    return new Promise((resolve, reject) => {
        db.del(collection, _id).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject(db.errMsg);
        });
    });
}

/**
 * 更新奖励状态
 */
const update = (_id, data) => {
    return new Promise((resolve, reject) => {
        db.update(collection, _id, data).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject(db.errMsg);
        });
    });
}

/**
 * 所有奖励
 */
const lists = (open_id, page = 0, partner_id = null, finish = false) => {
    const _ = db.command;
    let map = {
        _openid: (partner_id == null ? open_id : _.in([open_id, partner_id])),
        finish: (finish ? _.in([1, 2]) : 0)
    }
    
    return new Promise((resolve, reject) => {
        db.select(collection, map, 10, ['id', 'asc'], page).then(res => {
            resolve(res);
        }).catch((code, msg) => {            
            console.log(code, msg);            
            reject(db.errMsg);
        });
    });
}

/**
 * 奖励详情
 */
const detail = (_id) => {
    
}

module.exports = {
    add: add,
    del: del,
    update: update,
    lists: lists,
    detail: detail
}



