/**
 * 文章模块
 * 
 * @param avatar            发布者头像
 * @param partner_avatar    伙伴头像
 * @param image             发布图片
 * @param content           文章内容
 * @param time              发布日期
 * @param share             分享类型 0.自己、伙伴, 1.大厅
 * @param share_partner     是否分享给伙伴 false,true
 * @param partner_content   伙伴内容
 * @param partner_time      伙伴填写时间
 */

import db from "../util/db.js"

const collection = "Article";

/**
 * 增加文章
 * @param  data 
 */
const add = (data) => {
    let map = {
        avatar: data.avatar,
        partner_avatar: null,
        image: data.image ? data.image : null,
        content: data.content,
        time: new Date(),
        share: data.share,
        share_partner: data.share_partner
    }

    return new Promise((resolve, reject) => {
        db.add(collection, map).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject(db.errMsg);
        });
    });
}

/**
 * 删除文章
 * @param  _id 
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
 * 查看文章
 * @param  _id 
 */
const find = (_id) => {
    return new Promise((resolve, reject) => {
        db.find(collection, _id).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject(db.errMsg);
        })
    });
}

/**
 * 更新
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
 * 加载自己(和同伴)的文章
 * @param {*} open_id  
 * @param {*} page 
 * @param {*} partner_id 
 */
const listSelf = (open_id, page = 0, partner_id = null) => {
    return lists(page, open_id, partner_id);
}

/**
 * 加载大厅
 * @param {*} page 
 */
const lists = (page = 0, open_id = null, partner_id = null) => {
    const _ = db.command;

    let map = {
        share: (open_id == null ? 1 : _.in([0, 1])),   // 加载大厅数据还是两个人数据
    }

    if (open_id) {
        if (partner_id) {
            map._openid = _.in([open_id, partner_id]);
        } else {
            map._openid = open_id;
        }  
    }

    console.log(map);

    return new Promise((resolve, reject) => {
        db.select(collection, map, 10, ['time', 'desc'], page).then(res => {
            console.log(res);
            resolve(res);
        }).catch((code, msg) => {
            reject(db.errMsg);
        });
    });
}

module.exports = {
    add: add,
    del: del,
    find: find,
    update: update,
    listSelf: listSelf,
    lists: lists
}