/**
 * 全局常量文件
 */

 
/**
 * 系统
 */
const system = {
    netError: '服务器开小差啦'
}

/**
 * 登录界面
 */
const login = {
    title: 'We Daily',   // logo文字提示
    login: 'Start',         // 登录按钮
    loading: 'Loading',     // 登录中

    // tip1: '每天都在坚持\n养成好的习惯',
    // tip2: '当然,',
    tip3: '你是我的习惯',
    
}

/**
 * 引导页
 */
const hello = {
    tip1: {
        title: 'Hello ',    
        subTitle: '这是一份新手教程\n请查收',
    },

    // 邀请好友打卡
    tip2: {
        string1: '1. 邀请好友互相监督',
        string2: '点击邀请好友',
        string3: '点击分享'
        // string2: '2. 查看对方打卡情况',
        // string3: '3. 点击提醒对方打卡'
    },

    // 添加习惯，查看习惯，打卡
    tip3: {
        string1: '2. 查看对方打卡情况',
        string2: '点击可切换对方视角'
        // string1: '1. 点击添加习惯',
        // string2: '2. 查看今日习惯',
        // string3: '3. 点击习惯打卡'
    },
    
    // 关注公众号
    tip4: {
        string1: '3. 点击提醒对方打卡',
        string2: '点击对方任务即可发送提醒'
        // string1: '由于小程序限制',
        // string2: '关注公众号可以接收提醒'
    },

    // 结束
    tip5: {
        string1: 'We Daily',
        string2: 'Let\'s go!'
    }
}

/**
 * 我的
 */
const mine = {
    day: '使用We Daily ',
    inviteTip: '点击邀请好友一起打卡',
    myPartner: 'Ta',
    myPartnerGirl: '她',
    myPartnerBoy: '他',
    together: '一起努力的第 ',
    myHabit: '我的习惯',
    empty: '~ 空空如也 ~',
    addHabit: '点击添加习惯',
    
    habitTip1: '已打卡 ',
    habitTip2: '剩余 ',
    habitFinish: '已结束'
}

/**
 * 首页
 */
const index = {
    empty: '~ 空空如也 ~',
    addHabit: '点击添加习惯',
    finish: '已完成',
    reach: '达标',
    mine: '我',
    she: '她',
    he: '他',
    other: 'Ta',
    today: '今日',
    todayTip: '今日习惯',
    taTip: '的进度',

    newPartner: '欢迎小伙伴',
    relievePartner: '小伙伴与您解除关系',
    refreshPartner: '小伙伴已经洗白白啦',

    finishCard: '完成打卡',

    cancelTitle: '取消打卡',
    cancelContent: '年轻人你确定吗?',
    cancelCard: '已取消打卡',

    todayTipBtn: '加油鸭',
    todayMorningTip: '上午好',
    todayAfternoonTip: '下午好',
    todayTip1: '今天有',
    todayTip2: '件事待做',

    noFormIdTitle: '哎呀',
    noFormIdContent: '好姐妹已经离家出走啦\n请主动分享给对方吧\n^.^',
    noFormIdBtn: '好的',

    refreshTip: '我的伙伴',
    refreshNoTitle: '点击邀请好友一起打卡',
    refreshTitle: '点击刷新伙伴信息'
}

/**
 * 添加习惯
 */
const add = {
    egg: '~ 你是我的习惯 ~',
    mango: '@xxx',
    iconTip: '选一个图标',
    nameTip: '给习惯起一个名字叭',
    egTip: '跑步',
    beginTip: '什么时候行动呢',
    endTip: '截止时间',
    endPlaceholder: '一直坚持下去！',
    delete: '删除',
    finish: '我设置好了',
    
    nameLength: '10个字就好了哦',
    dateError: '好好选时间',
    saveError: '不！你没设置好',

    manyTitle: '习惯太多啦',
    manyContent: '太多习惯会很累的哦，删除一些再来吧',

    delTitle: '确定要删除嘛',
    delContent: '删除就不可恢复啦',
    delSuccess: '删除成功'
}

/**
 * 广场
 */
const square = {
    add: {
        placeholder: '写点什么',
        limitTip: '谁可以看',
        limitMy: '我们',
        limitWe: '我们俩',
        limitAll: '所有人',
        finish: '写完啦'
    },

    square: {
        navTitle: 'Write what you think',
        
        noMore: '只有这么多啦 ~',
        mine: '我的',
        square: '广场'
    },

    detail: {
        partnerAdd: '说点什么',
        partnerFinish: '写好了',
        placeholder: '给伙伴写的内容会显示在正文下方',
        delete: '删除'
    }
}

/**
 * 奖励
 */
const award = {
    add: {
        tip1: '奖励给',
        tip2: '选择一个习惯',
        tip3: '要奖励什么呢',
        namePlaceholder: '提示：最新款iPad',
        tip4: '写一些激励的话叭',
        detailPlaceholder: '坚持下来就买iPad！。',
        tip5: '当前任务剩余天数: ',
        tip6: '设置打卡次数',
        dayPlaceholder: '完成设置次数才可以领取奖励鸭',

        finish: '我设置好了',
    },

    award: {
        ongoing: '进行中',
        finish: '已结束',

        onEmptyTip: '还没有给自己设置奖励鸭',
        onEmptyButton: '~ 点击添加奖励叭 ~',

        finishEmptyTip: '还没有完成任何任务哦\n加油鸭！',

        fromHabit: '来自习惯: ',

        lastTime: '剩余天数',
        lastCount: '剩余次数',
        timeFinish: '结束',
        countFinish: '完成',

        toPartner: '奖励对方: ',
        toMyself: '奖励你: '
    }
}

/**
 * 邀请
 */
const invite = {
    bgTip: '选择背景图',
    nameTip: '对方昵称 (8字以内)',
    contentTip: '邀请的话 (15字以内)',

    placeholder: [
        // 情侣
        {
            name: '小可爱',
            content: '我们每天去跑步吧'
        },

        // girl
        {
            name: '嘿，姐妹',
            content: '我们互相监督打卡吧'
        },

        // boy
        {
            name: '在，',
            content: '我们互相监督打卡吧'
        }
    ],

    inviteBtn: '发送邀请',

    receive: '我来了',
    reject: '算了叭~',

    mangoTip: 'We Daily -- 你是我的习惯'
}

/**
 * 设置
 */
const setting = {
    tip1: 'We Daily 🍻',
    setting1: [
        '使用教程',
        '开发日记',
        '官网'
    ],

    tip2: '设置',
    setting2: [
        '提示框风格',
        '刷新绑定信息',
        '解除绑定'
    ],

    tip3: '关于作者',
    setting3: [
        'Zero'
    ],

    footer: [
        '',
        '',
        '',
        '',
        ''
    ]
}

/**
 * About
 */
const about = {
    zero: {
        title: 'Zero',
        content: '前端开发工程师，目前主力研究iOS原生开发。\n有很多稀奇古怪的想法。\n 如果您对本作品有什么意见或建议，请与我联系。\n\n WeChat: (点击复制)'
    }
}

/**
 * 日历
 */
const calendar = {
    editHabit: '编辑习惯',
    
    detail: {
        nameTip: '奖励:',
        contentTip: '寄语:',
        lastTip: '剩余:',
        finish: '已达成',

        timeTip: '奖励开始于: ',

        award: '完成',
        delete: '删除'
    }
}

module.exports = {
    sys: system,
    login: login,
    hello: hello,
    mine: mine,
    index: index,
    add: add,
    square: square,
    award: award,
    setting: setting,
    about: about,
    calendar: calendar,
    invite: invite
}