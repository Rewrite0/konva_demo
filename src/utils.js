/*global Konva*/

/**
 * 元素hover事件
 * @param {KonvaEl} el el
 * @param {object, function} enter 鼠标悬浮样式或回调函数
 * @param {object, function} leave 鼠标移出样式或回调函数
 */
function elHover(el, enter, leave) {
  el.on('mouseenter', function () {
    if (typeof enter === 'object') {
      new Konva.Tween({
        node: this,
        duration: 0.2,
        ...enter,
      }).play();
    } else if (typeof enter === 'function') {
      enter();
    }
  });

  el.on('mouseleave', function () {
    if (typeof enter === 'object') {
      new Konva.Tween({
        node: this,
        duration: 0.2,
        ...leave,
      }).play();
    } else if (typeof leave === 'function') {
      leave();
    }
  });
}

export { elHover };
