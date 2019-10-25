const db = wx.cloud.database();

/**
 * 响应代码
 * 20x: 成功
 * 40x: 失败
 */
const resCode = {
    200: "success",
    401: "prameters error",     // 参数错误
}

/**
 * 错误文字提示
 */
const errMsg = "服务器离家出走惹:(";

/**
 * Collection列表
 */
const collectionList = [
    "User",     // 用户表
    "Habit",    // 习惯表
    "Partner",  // 伙伴表
    "Record",   // 打卡记录
    "FormID",   // 表单ID
    "Article",  // 文章
    "Award",    // 奖励
]

const command = db.command;

/**
 * 增加数据
 * @param collection    collection名 自行检查是否正确
 * @param data          要增加的数据
 */
const add = (collection, data) => {
    return new Promise((resolve, reject) => {
        if (!exist(collection) || data == null) {
            reject(401, resCode[401]);
            return ;
        }       

        db.collection(collection).add({
            data: data
        }).then(res => {
            // 返回原先的数据，同时返回新插入的ID
            data._id = res;
            resolve(data);
        }).catch((code, msg) => {
            reject(code, msg);
        });
    });
}

/**
 * 查询数据(单条)
 * @param collection    collection名
 * @param _id           数据ID
 */
const find = (collection, _id) => {
    return new Promise((resolve, reject) => {
        if (!exist(collection) || _id == null) {
            reject(401, resCode[401]);
        }

        db.collection(collection).doc(_id).get().then(res => {
            resolve(res.data);
        }).catch((code, msg) => {
            reject(code, msg);
        });
    });
}

/**
 * 查询数据
 * @param collection    collection名
 * @param where         查询条件, 可选
 * @param limit         限制条数，小程序官方20，本项目默认10
 * @param order         排序条件，数组，
 */
const select = (collection, where = null, limit = 10, order = ['_id', 'asc'], page = 0) => {
    return new Promise((resolve, reject) => {
        if (!exist(collection)) {
            reject(401, resCode[401]);
        }
    
        db.collection(collection)
            .where(where)
            .orderBy(order[0], order[1])
            .limit(limit)
            .skip(page * limit)
            .get()
            .then(res => {
                resolve(res.data);
            }).catch( (code, msg) => {
                reject(code, msg);
            });
    });
}

/**
 * 删除
 * @param collection    collection名
 * @param _id           数据ID
 */
const del = (collection, _id) => {
    return new Promise((resolve, reject) => {
        
        if (!exist(collection)) {
            reject(401, resCode["401"]);
        }
    
        db.collection(collection).doc(_id).remove().then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject(code, msg);
        });
    });
}

/**
 * 更新数据
 */
const update = (collection, _id, data) => {
    return new Promise((resolve, reject) => {
        if (!exist(collection)) {
            reject(401, resCode[401]);
        }
    
        db.collection(collection).doc(_id).update({
            data: data
        }).then(res => {
            resolve(res);
        }).catch((code, msg) => {
            reject(code, msg);
        });
    });
}

/**
 * 获取数据数量
 */
const count = (collection, where) => {
    return new Promise((resolve, reject) => {
        if (!exist(collection)) {
            reject(401, resCode[401]);
        }

        db.collection(collection)
            .where(where)
            .count()
            .then(res => {
                resolve(res.total);
            }).catch((code, msg) => {
                reject(code, msg);
            });
    });
}


/**
 * 检查Collection是否存在
 */
const exist = (collection) => {
    // forEach 无法跳出，用some代替测试
    let exist = false;
    collectionList.some((value, _) => {
        if (value == collection) {            
            exist = true;
            return true;
        }
    });

    return exist;
}


/// exports
module.exports = {
    db: db,
    command: command,
    resCode: resCode,
    add: add,
    find: find,
    select: select,
    del: del,
    update: update,
    count: count,
    errMsg: errMsg
}

