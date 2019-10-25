/**
 * 动画库
 */
/**
 * 动画库
 */

 /**
  * 从下往上淡入
  * @param distance     向上移动的距离 (单位 px)
  * @param duration     持续时间 (默认 1000ms)
  * @param delay        延迟时间 (默认 0ms)
  */
const fadeInUp = (distance, duration = 1000, delay = 0) => {
    let ani = wx.createAnimation({
        duration: duration,
        timingFunction: "ease"
    });

    ani.opacity(1).translateY(-distance).step();

    return ani.export();
}

module.exports = {
    fadeInUp: fadeInUp
}