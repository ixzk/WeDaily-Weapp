/**
 * 打卡记录表
 * @param habit_id      习惯ID
 * @param time          打卡时间
 */

import db from "../util/db.js";
import Habit from "./Habit.js";

const collection = "Record";

/**
 * 打卡
 * @param habit_id  习惯ID
 */
const finish = (habit_id) => {
    return new Promise((resolve, reject) => {
        const _ = db.command;

        db.add(collection, {
            habit_id: habit_id,
            time: new Date()
        }).then(res => {
            Habit.update(habit_id, {
                times: _.inc(1) 
            }).then(_ => {
                resolve(res);
            }).catch((code, msg) => {
                reject("服务器开小差啦");
            });
        }).catch((code, msg) => {            
            reject("服务器开小差啦");
        });
    });
}

/**
 * 取消打卡
 * @param _id   记录ID
 */
const cancel = (_id, habit_id, count = 0) => {
    return new Promise((resolve, reject) => {
        const _ = db.command;
        console.log(count);
        db.del(collection, _id).then(res => {
            Habit.update(habit_id, {
                times: (count > 0 ? count - 1 : 0) 
            }).then(_ => {
                resolve(res);
            }).catch((code, msg) => {
                reject("服务器开小差啦");
            });
        }).catch((code, msg) => {
            console.log(code, msg);
            reject("服务器开小差啦");
        });
    });
}

/**
 * 当天打卡查询
 */
const today = (open_id, partner_id = null) => {
    return new Promise((resolve, reject) => {
        let _ = db.command;
        let time  = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        let start = new Date(time);
        let end   = new Date(time + 24 * 3600 * 1000);
        db.select(collection, {
            _openid: (partner_id == null ? open_id : _.in([open_id, partner_id])),
            time: _.gte(start).and(_.lt(end))
        }, 20).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject("服务器开小差啦");
        });
    });
}

/**
 * 本月打卡记录
 */
const month = (habit_id, month) => {
    let date = new Date();
    let year = date.getFullYear();
    let start = new Date(year, month, 1);
    let end = new Date(year, month + 1, 1);      

    const _ = db.command;

    return new Promise((resolve, reject) => {
        db.select(collection, {
            habit_id: habit_id,
            time: _.gte(start).and(_.lte(end))
        }, 31).then(res => {            
            resolve(res);
        }).catch((code, msg) => {
            reject("服务器离家出走啦");
        })
    })
}

module.exports = {
    finish: finish,
    cancel: cancel,
    today: today,
    month: month
}

