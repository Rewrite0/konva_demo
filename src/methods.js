/*global Konva*/
import { elHover } from './utils.js';
import { buttons as finishs } from './finish/const.js';
import { toothIdList } from './tooth/const.js';

/**
 * button 处理事件
 * @param {state} state app state
 * @param {KonvaEl} button button
 */
function handleButtonEvent(state, button) {
  elHover(
    button,
    (e) => {
      state.selected.forEach((id) => {
        const tooth = state.stage.findOne(`#${id}`);
        if (tooth.state.includes(e.attrs.name)) {
          e.opacity(0.5);
        } else {
          new Konva.Tween({
            node: e,
            duration: 0.2,
            opacity: 0.7,
          }).play();
        }
      });
    },
    (e) => {
      if (e.attrs.name === 'clear_selected') {
        new Konva.Tween({
          node: e,
          duration: 0.2,
          opacity: 1,
        }).play();
      }

      state.selected.forEach((id) => {
        const tooth = state.stage.findOne(`#${id}`);
        if (tooth.state.includes(e.attrs.name)) {
          e.opacity(0.5);
        } else {
          new Konva.Tween({
            node: e,
            duration: 0.2,
            opacity: 1,
          }).play();
        }
      });
    }
  );

  button.on('click tap', function () {
    const name = this.attrs.name;
    this.opacity(0.3);

    finishs.forEach((e) => {
      if (e.name === name) {
        new Konva.Tween({
          node: this,
          duration: 0.2,
          opacity: 1,
        }).play();
      } else {
        state.selected.forEach((id) => {
          const tooth = state.stage.findOne(`#${id}`);
          if (tooth.state.includes(name)) {
            new Konva.Tween({
              node: this,
              duration: 0.2,
              opacity: 1,
            }).play();
          } else {
            new Konva.Tween({
              node: this,
              duration: 0.2,
              opacity: 0.5,
            }).play();
          }
        });
      }
    });

    if (name === 'reset') {
      console.log('reset');
      resetToothGroup(state);
      return;
    } else if (name === 'cancel') {
      typeof state.on.cancel == 'function' && state.on.cancel(state);
      console.log('cancel');
      return;
    } else if (name === 'finish') {
      typeof state.on.finish == 'function' && state.on.finish(state);
      console.log('finish');
      return;
    }

    if (state.selected.length === 0) return;
    // 清空
    if (name == 'clear_selected' && state.selected.length > 0) {
      clearSelected(state);
      return;
    }

    if (['lever_clamp', 'bridge', 'crown_bridge'].includes(name)) {
      setToothConnect(state, name);
      return;
    }

    // 其余button
    state.selected.forEach((id) => {
      const el = state.stage.findOne(`#${id}`);
      setToothState(state, el, name);
    });
  });
}

/**
 * tooth 处理事件
 * @param {state} state app state
 * @param {KonvaEl} tooth tooth
 */
function handleToothEvent(state, tooth) {
  tooth.on('mouseenter', function () {
    const id = this.attrs.id;
    if (!state.selected.includes(id)) {
      new Konva.Tween({
        node: this.findOne('.tooth-box'),
        duration: 0.2,
        strokeWidth: 1,
      }).play();
    }
  });

  tooth.on('mouseleave', function () {
    const id = this.attrs.id;
    if (!state.selected.includes(id)) {
      new Konva.Tween({
        node: this.findOne('.tooth-box'),
        duration: 0.2,
        strokeWidth: 0,
      }).play();
    }
  });

  tooth.on('click tap', function () {
    const id = this.attrs.id;

    if (state.selected.includes(id)) {
      console.log('取消选中', id);
      const selected = state.selected.filter((e) => e !== id);
      state.selected = selected;

      this.opacity(0.5);
      new Konva.Tween({
        node: this,
        duration: 0.2,
        opacity: 1,
      }).play();
      this.findOne('.tooth-box').stroke('rgba(56,113,227,0.5)');
    } else {
      console.log('选中', id);
      state.selected = [...state.selected, id];

      this.opacity(0.5);
      new Konva.Tween({
        node: this,
        duration: 0.2,
        // strokeWidth: 1,
        opacity: 1,
      }).play();
      this.findOne('.tooth-box').stroke('rgba(56,113,227,1)');
    }
  });
}

/**
 * 清空选中
 * @param {state} state app state
 */
function clearSelected(state) {
  state.selected = [];
  const tooth = state.stage.find('.tooth-box');
  tooth.forEach((e) => {
    e.strokeWidth(0);
  });
}

/**
 * 重置tooth状态
 * @param {state} state app state
 */
function resetToothGroup(state) {
  toothIdList.forEach((e) => {
    e.forEach((id) => {
      const tooth = state.stage.findOne(`#tooth-${id}`);

      setToothState(state, tooth, 'default');

      if (tooth.findOne('.lever-clamp-line')) {
        tooth.findOne('.lever-clamp-line').remove();
        tooth.findOne('.lever-clamp-rect').remove();
      } else if (tooth.findOne('.bridge-line')) {
        tooth.findOne('.bridge-line').remove();
        tooth.findOne('.bridge-circle').remove();
      }

      if (tooth.findOne('.crown-bridge-line')) {
        tooth.findOne('.crown-bridge-line').remove();
      }

      clearSelected(state);
    });
  });
}

/**
 * 设置杆卡, 桥架, 冠桥事件
 * @param {state} state app state
 * @param {string} status 状态
 */
function setToothConnect(state, status) {
  const list = state.selected;

  let up = [];
  let down = [];
  let noset = false;

  list.forEach((id) => {
    // 判断选中的牙是否在已设置的牙中, 如果是则清空所在的组
    if (state.data[status].includes(id)) {
      let group;

      noset = true;

      if (Number(id.match(/\d+/g)) < 30) {
        group = state.data[status].filter((e) => {
          return Number(e.match(/\d+/g)) < 30;
        });
      } else {
        group = state.data[status].filter((e) => {
          return Number(e.match(/\d+/g)) > 30;
        });
      }

      group.forEach((id) => {
        const tooth = state.stage.findOne(`#${id}`);
        tooth.state = tooth.state.filter((e) => e !== status);

        switch (status) {
          case 'lever_clamp':
            tooth.findOne('.lever-clamp-line').remove();
            tooth.findOne('.lever-clamp-rect').remove();
            break;
          case 'bridge':
            tooth.findOne('.bridge-line').remove();
            tooth.findOne('.bridge-circle').remove();
            break;
          case 'crown_bridge':
            tooth.findOne('.crown-bridge-line').remove();
            setToothState(state, tooth, 'crown');
            break;
        }

        state.data[status] = state.data[status].filter((e) => e !== id);

        if (tooth.state.length == 0) {
          tooth.state = [...tooth.state, 'default'];
          tooth.findOne('.default').show();
        }
      });

      return;
    } else {
      if (list.length < 2) {
        alert('请至少选择两个牙齿');

        clearSelected(state);
        return;
      }
    }

    const number = Number(id.match(/\d+/g));
    if (number > 30) {
      down.push(number);
    } else {
      up.push(number);
    }
  });

  if (noset) return;

  // 获取所有需要处理的牙齿id
  const getAllList = (arr) => {
    if (arr.length == 0) return { result: [], point: [] };
    let max = Math.max.apply(null, arr);
    let min = Math.min.apply(null, arr);
    let result = [];
    let point = [];

    if (max - (max % 10) == min - (min % 10)) {
      point = [min, max];
      while (min <= max) {
        result.push(min);
        min += 1;
      }
    } else {
      if (max < 30) {
        // up
        let tl = Math.max.apply(
          null,
          arr.filter((e) => e < 20)
        );

        point = [tl, max];

        while (tl >= tl - (tl % 10) + 1) {
          result.push(tl);
          tl -= 1;
        }

        while (max >= max - (max % 10) + 1) {
          result.push(max);
          max -= 1;
        }
      } else {
        // down
        let br = Math.max.apply(
          null,
          arr.filter((e) => e > 30 && e < 40)
        );

        point = [br, max];

        while (br >= br - (br % 10) + 1) {
          result.push(br);
          br -= 1;
        }

        while (max >= max - (max % 10) + 1) {
          result.push(max);
          max -= 1;
        }
      }
    }

    return {
      result,
      point,
    };
  };

  up = getAllList(up);
  down = getAllList(down);

  let newArr = [...up.result, ...down.result];

  state.selected = [];
  newArr.forEach((id) => {
    state.selected = [...state.selected, `tooth-${id}`];
    const tooth = state.stage.findOne(`#tooth-${id}`);

    // 选中样式
    tooth.findOne('.tooth-box').strokeWidth(1);
    tooth.findOne('.tooth-box').stroke('rgba(56,113,227,1)');
  });

  if (status == 'lever_clamp') {
    setLeverClamp(state, up.result, up.point);
    setLeverClamp(state, down.result, down.point);
  } else if (status == 'bridge') {
    setBridge(state, up.result, up.point);
    setBridge(state, down.result, down.point);
  } else if (status == 'crown_bridge') {
    setCrownBridge(state, up.result, up.point);
    setCrownBridge(state, down.result, down.point);
  }
}

/**
 * 设置杆卡样式, 需分上下两层
 * @param {state} state app state
 * @param {array} arr 需要设置杆卡样式的id列表
 * @param {array} arr 该层的两个端点
 */
function setLeverClamp(state, arr = [], point = []) {
  if (arr.length == 0) return;
  const max = Math.max.apply(null, point);
  const min = Math.min.apply(null, point);
  let style = {
    // fill: '#c95820',
    fill: 'orange',
    name: 'lever-clamp-rect',
    width: 10,
    height: 10,
    offset: {
      x: 5,
      y: 5,
    },
  };
  const offsetY = 65;

  let isReturn = true;
  let noset = false;

  arr.forEach((id) => {
    const tooth = state.stage.findOne(`#tooth-${id}`);

    if (tooth.state.includes('bridge')) noset = true;

    if (!tooth.state.includes('lever_clamp')) {
      isReturn = false;
    }
  });

  if (noset) return;

  arr.forEach((id) => {
    const tooth = state.stage.findOne(`#tooth-${id}`);
    const attrs = tooth.attrs;
    const y = max < 30 ? attrs.height / 2 - offsetY : offsetY;

    if (tooth.state.includes('lever_clamp')) {
      // 清除已有
      tooth.state = tooth.state.filter((e) => e !== 'lever_clamp');
      tooth.findOne('.lever-clamp-line').remove();
      tooth.findOne('.lever-clamp-rect').remove();
      state.data.lever_clamp = state.data.lever_clamp.filter((e) => e !== `tooth-${id}`);

      if (tooth.state.length == 0) {
        tooth.state = [...tooth.state, 'default'];
        tooth.findOne('.default').show();
      }

      if (isReturn) return;
    } else {
      tooth.state = tooth.state.filter((e) => e !== 'default');
      tooth.findOne('.default').hide();
    }

    tooth.state = [...tooth.state, 'lever_clamp'];

    const rect = new Konva.Rect({
      ...style,
      x: attrs.width / 2,
      y,
    });

    tooth.add(rect);

    const lineStyle = {
      name: 'lever-clamp-line',
      id: `lcl-${id}`,
      stroke: style.fill,
      strokeWidth: 2,
      points: [0, y, attrs.width, y],
    };

    const left = [attrs.width / 2, y, attrs.width, y];
    const right = [0, y, attrs.width / 2, y];

    if (point.includes(id)) {
      const number = id - (id % 10);
      if (max - (max % 10) == min - (min % 10)) {
        if (id == max) {
          switch (number) {
            case 10:
              lineStyle.points = left;
              break;
            case 20:
              lineStyle.points = right;
              break;
            case 30:
              lineStyle.points = right;
              break;
            case 40:
              lineStyle.points = left;
              break;
          }
        } else {
          switch (number) {
            case 10:
              lineStyle.points = right;
              break;
            case 20:
              lineStyle.points = left;
              break;
            case 30:
              lineStyle.points = left;
              break;
            case 40:
              lineStyle.points = right;
              break;
          }
        }
      } else {
        switch (number) {
          case 10:
            lineStyle.points = left;
            break;
          case 20:
            lineStyle.points = right;
            break;
          case 30:
            lineStyle.points = right;
            break;
          case 40:
            lineStyle.points = left;
            break;
        }
      }
    }

    const line = new Konva.Line({
      ...lineStyle,
    });
    tooth.add(line);

    updateData(state, `tooth-${id}`);
  });
}

/**
 * 设置桥架样式
 * @param {state} state app state
 * @param {array} arr 需要设置杆卡样式的id列表
 * @param {array} arr 该层的两个端点
 */
function setBridge(state, arr = [], point = []) {
  if (arr.length == 0) return;
  const max = Math.max.apply(null, point);
  const min = Math.min.apply(null, point);
  let style = {
    fill: '#76c914',
    name: 'bridge-circle',
    width: 10,
    height: 10,
  };
  const offsetY = 65;

  let isReturn = true;
  let noset = false;

  arr.forEach((id) => {
    const tooth = state.stage.findOne(`#tooth-${id}`);

    if (tooth.state.includes('lever_clamp')) noset = true;

    if (!tooth.state.includes('bridge')) {
      isReturn = false;
    }
  });

  if (noset) return;

  arr.forEach((id) => {
    const tooth = state.stage.findOne(`#tooth-${id}`);
    const attrs = tooth.attrs;
    const y = max < 30 ? attrs.height / 2 - offsetY : offsetY;

    if (tooth.state.includes('bridge')) {
      tooth.state = tooth.state.filter((e) => e !== 'bridge');
      tooth.findOne('.bridge-line').remove();
      tooth.findOne('.bridge-circle').remove();
      state.data.bridge = state.data.bridge.filter((e) => e !== `tooth-${id}`);

      if (tooth.state.length == 0) {
        tooth.state = [...tooth.state, 'default'];
        tooth.findOne('.default').show();
      }

      if (isReturn) return;
    } else {
      tooth.state = tooth.state.filter((e) => e !== 'default');
      tooth.findOne('.default').hide();
    }

    tooth.state = [...tooth.state, 'bridge'];

    const rect = new Konva.Circle({
      ...style,
      x: attrs.width / 2,
      y,
    });

    tooth.add(rect);

    const lineStyle = {
      name: 'bridge-line',
      id: `lcl-${id}`,
      stroke: style.fill,
      strokeWidth: 2,
      points: [0, y, attrs.width, y],
    };

    const left = [attrs.width / 2, y, attrs.width, y];
    const right = [0, y, attrs.width / 2, y];

    if (point.includes(id)) {
      const number = id - (id % 10);
      if (max - (max % 10) == min - (min % 10)) {
        if (id == max) {
          switch (number) {
            case 10:
              lineStyle.points = left;
              break;
            case 20:
              lineStyle.points = right;
              break;
            case 30:
              lineStyle.points = right;
              break;
            case 40:
              lineStyle.points = left;
              break;
          }
        } else {
          switch (number) {
            case 10:
              lineStyle.points = right;
              break;
            case 20:
              lineStyle.points = left;
              break;
            case 30:
              lineStyle.points = left;
              break;
            case 40:
              lineStyle.points = right;
              break;
          }
        }
      } else {
        switch (number) {
          case 10:
            lineStyle.points = left;
            break;
          case 20:
            lineStyle.points = right;
            break;
          case 30:
            lineStyle.points = right;
            break;
          case 40:
            lineStyle.points = left;
            break;
        }
      }
    }

    const line = new Konva.Line({
      ...lineStyle,
    });
    tooth.add(line);

    updateData(state, `tooth-${id}`);
  });
}

/**
 * 设置冠桥样式
 * @param {state} state app state
 * @param {array} arr 需要设置杆卡样式的id列表
 * @param {array} arr 该层的两个端点
 */
function setCrownBridge(state, arr = [], point = []) {
  if (arr.length == 0) return;
  const max = Math.max.apply(null, point);
  const min = Math.min.apply(null, point);
  const offsetY = 100;

  let isReturn = true;
  let isInner = false;

  arr.forEach((id) => {
    const tooth = state.stage.findOne(`#tooth-${id}`);

    if (!tooth.state.includes('crown_bridge')) {
      isReturn = false;
    }
  });

  arr.forEach((id) => {
    const tooth = state.stage.findOne(`#tooth-${id}`);
    const attrs = tooth.attrs;

    if (tooth.state.includes('crown_bridge')) {
      tooth.state = tooth.state.filter((e) => e !== 'crown_bridge');
      tooth.findOne('.crown-bridge-line').remove();
      setToothState(state, tooth, 'crown');

      if (isReturn) return;
    }

    tooth.state = [...tooth.state, 'crown_bridge'];

    const y = max < 30 ? attrs.height / 2 - offsetY : offsetY;
    const lineStyle = {
      name: 'crown-bridge-line',
      id: `lcl-${id}`,
      stroke: '#fff',
      strokeWidth: 2,
      points: [0, y, attrs.width, y],
    };

    const left = [attrs.width / 2, y, attrs.width, y];
    const right = [0, y, attrs.width / 2, y];

    if (point.includes(id)) {
      const number = id - (id % 10);
      if (max - (max % 10) == min - (min % 10)) {
        if (id == max) {
          switch (number) {
            case 10:
              lineStyle.points = left;
              break;
            case 20:
              lineStyle.points = right;
              break;
            case 30:
              lineStyle.points = right;
              break;
            case 40:
              lineStyle.points = left;
              break;
          }
        } else {
          switch (number) {
            case 10:
              lineStyle.points = right;
              break;
            case 20:
              lineStyle.points = left;
              break;
            case 30:
              lineStyle.points = left;
              break;
            case 40:
              lineStyle.points = right;
              break;
          }
        }
      } else {
        switch (number) {
          case 10:
            lineStyle.points = left;
            break;
          case 20:
            lineStyle.points = right;
            break;
          case 30:
            lineStyle.points = right;
            break;
          case 40:
            lineStyle.points = left;
            break;
        }
      }
    }

    const line = new Konva.Line({
      ...lineStyle,
    });
    tooth.add(line);
    line.zIndex(0);

    // if (!tooth.state.includes('crown')) {
    //   setToothState(state, tooth, 'crown');
    // }

    updateData(state, `tooth-${id}`);
  });
}

/**
 * 设置tooth状态
 * @param {state} state app state
 * @param {KonvaEl} tooth tooth el
 * @param {string} status 状态 - default, crown, default_crown, inlay, only_crown, trim, abutment, implant, post_core
 */
function setToothState(state, tooth, status) {
  const id = tooth.attrs.id;

  // 默认， 冠， 默认冠， 嵌体， 只有冠， 贴面, 基台, 植体, 桩核
  const all = [
    'default',
    'crown',
    'inner_crown',
    'default_crown',
    'inlay',
    'only_crown',
    'trim',
    'abutment',
    'implant',
    'post_core',
  ];

  // 冲突
  const clash = [
    // 桩核, 基台
    ['post_core', 'abutment'],
    // 桩核, 植体
    ['post_core', 'implant'],
    // 贴面, 嵌体, 牙冠
    ['trim', 'inlay', 'crown'],
    // 贴面, 嵌体, 内冠
    ['trim', 'inlay', 'inner_crown'],
    // 植体, 牙根, 贴面, 嵌体,
    ['implant', 'trim', 'inlay', 'default'],
    // 基台, 牙根, 贴面, 嵌体,
    ['abutment', 'trim', 'inlay', 'default'],
    // 杆卡, 桥架
    ['lever_clamp', 'bridge'],
  ];

  // 拦截
  const intercept = {
    lever_clamp: ['inlay', 'trim', 'post_core'],
    bridge: ['inlay', 'trim', 'post_core'],
    crown_bridge: ['inlay', 'trim', 'post_core', 'inner_crown'],
    inner_crown_bridge: ['inlay', 'trim', 'post_core', 'crown'],
  };

  // 拦截操作
  for (const key in intercept) {
    if (tooth.state.includes(key) && intercept[key].includes(status)) return;
  }

  if (tooth.state.includes('crown') && tooth.state.includes('crown_bridge')) {
    if (status === 'crown') return;
  }

  // 添加状态
  if (tooth.state.includes(status)) {
    // 已有该状态
    console.log('已有状态', status);

    tooth.state = tooth.state.filter((e) => e !== status);
    if (tooth.state.length === 0) {
      tooth.state.push('default');
    }

    // 重设冲突
    tooth.state.forEach((s) => {
      clash.forEach((g) => {
        if (g.includes(s)) {
          const newClash = g.filter((e) => e !== s);
          // 去除旧冲突状态
          g.forEach((s) => {
            tooth.clash = tooth.clash.filter((e) => e !== s);
          });

          // 加入新冲突
          tooth.clash = [...tooth.clash, ...newClash];

          // 去重
          tooth.clash = tooth.clash.filter(
            (item, index) => tooth.clash.indexOf(item) === index
          );
        }
      });
    });
  } else if (tooth.clash.includes(status)) {
    // 冲突中有该状态
    console.log(status, '存在于冲突列表');
    clash.forEach((g) => {
      if (g.includes(status)) {
        console.log('该冲突项', g, '包含当前状态', status);
        // 找到该状态的冲突项
        const newClash = g.filter((e) => e !== status);
        console.log(status, '对应冲突项', newClash);

        // 找到当前tooth状态中包含哪个冲突 并去除旧状态
        newClash.forEach((s) => {
          if (tooth.state.includes(s)) {
            console.log('冲突状态', s);
            // 去除旧状态
            tooth.state = tooth.state.filter((e) => e !== s);
          }
        });
        // 将新状态加入状态列表
        tooth.state.push(status);

        // 去除旧冲突状态
        g.forEach((s) => {
          tooth.clash = tooth.clash.filter((e) => e !== s);
        });
        // 加入新冲突
        tooth.clash = [...tooth.clash, ...newClash];

        // 去重
        tooth.state = tooth.state.filter(
          (item, index) => tooth.state.indexOf(item) === index
        );
        tooth.clash = tooth.clash.filter(
          (item, index) => tooth.clash.indexOf(item) === index
        );

        console.log('tooth', tooth.state, tooth.clash);
      }
    });
  } else {
    // 没有该状态
    clash.forEach((g) => {
      // 查找改状态对应的冲突列表
      if (g.includes(status)) {
        // 将其他冲突状态加入冲突列表
        const arr = g.filter((e) => e !== status);
        tooth.clash = [...tooth.clash, ...arr];
      }
    });
    tooth.state.push(status);
    // 去重
    tooth.clash = tooth.clash.filter(
      (item, index) => tooth.clash.indexOf(item) === index
    );
  }
  console.log('tooth', tooth);

  if (status === 'default') {
    tooth.state = ['default'];
    tooth.clash = ['implant', 'abutment'];
  }

  // 如果是贴面或嵌体, 将default移除冲突
  if (['trim', 'inlay', 'post_core'].includes(status)) {
    tooth.clash = tooth.clash.filter((e) => e !== 'default');
  }

  // 清空状态显示
  all.forEach((e) => {
    tooth.findOne(`.${e}`).hide();
  });

  if (!tooth.clash.includes('default')) {
    tooth.findOne('.default').show();
  }

  // 没有牙根的状态
  // const noToothRoot = ['abutment', 'implant'];
  // 显示已有状态和特殊状态
  tooth.state.forEach((s) => {
    if (!['lever_clamp', 'bridge', 'crown_bridge'].includes(s)) {
      tooth.findOne(`.${s}`).show();
    }

    // if (noToothRoot.includes(s) && !tooth.state.includes('crown')) {
    //   tooth.findOne('.default_crown').show();
    // }

    if (['lever_clamp', 'bridge'].includes(s)) {
      tooth.findOne('.default').hide();
    }
  });

  updateData(state, id);
}

/**
 * 更新数据
 * @param {state} state app state
 * @param {string} id tooth id
 */
function updateData(state, id) {
  const tooth = state.stage.findOne(`#${id}`);
  // 更新数据结果
  for (const key in state.data) {
    // 清空当前tooth状态数据
    if (state.data[key].includes(id)) {
      state.data[key] = state.data[key].filter((e) => e !== id);
    }

    // 加入新状态
    if (tooth.state.includes(key)) {
      state.data[key].push(id);
    }
  }

  // 冠桥去重
  if (state.data['crown_bridge'].length !== 0) {
    state.data['crown_bridge'].forEach((id) => {
      state.data['crown'] = state.data['crown'].filter((e) => e !== id);
    });
  }

  state.selected = state.selected;
  console.log('结果', state.data);
}

export {
  handleButtonEvent,
  handleToothEvent,
  setToothState,
  resetToothGroup,
  updateData,
  clearSelected,
  setToothConnect,
};
