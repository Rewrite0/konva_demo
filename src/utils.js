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
    } else if (typeof enter == 'function') {
      enter(this);
    }
  });

  el.on('mouseleave', function () {
    if (typeof leave === 'object') {
      new Konva.Tween({
        node: this,
        duration: 0.2,
        ...leave,
      }).play();
    } else if (typeof leave == 'function') {
      leave(this);
    }
  });
}

/**
 * 获取牙位名
 * @param {String} en key名
 * @returns name
 */
function toothName(en) {
  const obj = {
    crown: '冠',
    inlay: '嵌体',
    implant: '植体',
    lever_clamp: '杆卡',
    post_core: '桩核',
    crown_bridge: '冠桥',
    trim: '贴面',
    abutment: '个性化基台',
    bridge: '桥架',
    inner_crown: '内冠',
    inner_crown_bridge: '内冠桥',
  };

  return obj[en];
}

export { elHover, toothName };
