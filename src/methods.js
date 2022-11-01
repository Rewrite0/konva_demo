/*global Konva*/
import { elHover } from './utils.js';
import { state } from './state.js';

/**
 * button 处理事件
 * @param {KonvaEl} button button
 */
function handleButtonEvent(button) {
  elHover(
    button,
    {
      opacity: 0.7,
    },
    {
      opacity: 1,
    }
  );

  button.on('click tap', function () {
    const name = this.attrs.name;
    this.opacity(0.3);
    new Konva.Tween({
      node: this,
      duration: 0.2,
      opacity: 0.7,
    }).play();

    if (state.selected.length === 0) return;
    // 清空
    if (name == 'clear_selected' && state.selected.length > 0) {
      state.selected = [];
      const tooth = state.stage.find('.tooth-box');
      tooth.forEach((e) => {
        e.strokeWidth(0);
      });
      return;
    }

    if (['lever_clamp', 'bridge', 'crown_bridge'].includes(name)) {
      setToothConnect(name);
      return;
    }

    // 其余button
    state.selected.forEach((id) => {
      const el = state.stage.findOne(`#${id}`);
      setToothState(el, name);
    });
  });
}

/**
 * tooth 处理事件
 * @param {KonvaEl} tooth tooth
 */
function handleToothEvent(tooth) {
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
 * 设置杆卡, 桥架, 冠桥事件
 * @param {string} status 状态
 */
function setToothConnect(status) {
  const list = state.selected;
  let up = [];
  let down = [];

  list.forEach((id) => {
    const number = Number(id.match(/\d+/g));
    if (number > 30) {
      down.push(number);
    } else {
      up.push(number);
    }
  });

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
    setLeverClamp(up.result, up.point);
    setLeverClamp(down.result, down.point);
  }
}

/**
 * 设置杆卡样式, 需分上下两层
 * @param {array} arr 需要设置杆卡样式的id列表
 * @param {array} arr 该层的两个端点
 */
function setLeverClamp(arr = [], point = []) {
  if (arr.length == 0) return;
  const max = Math.max.apply(null, point);
  const min = Math.min.apply(null, point);
  let style = {
    fill: '#c95820',
    name: 'rect',
    width: 10,
    height: 10,
    offset: {
      x: 5,
      y: 5,
    },
  };
  const offsetY = 65;

  arr.forEach((id) => {
    const tooth = state.stage.findOne(`#tooth-${id}`);
    const attrs = tooth.attrs;
    const y = max < 30 ? attrs.height / 2 - offsetY : offsetY;

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
      strokeWidth: 1,
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
  });
}

/**
 * 设置tooth状态
 * @param {KonvaEl} tooth tooth el
 * @param {string} status 状态 - default, crown, default_crown, inlay, only_crown, trim, abutment, implant, post_core
 */
function setToothState(tooth, status) {
  const id = tooth.attrs.id;
  // const group = tooth.findOne('.state-group');
  // 已有状态
  tooth.state = tooth.state || ['default'];
  // 冲突状态
  tooth.clash = tooth.clash || ['implant', 'abutment'];

  // 默认， 冠， 默认冠， 嵌体， 只有冠， 贴面, 基台, 植体, 桩核
  const all = [
    'default',
    'crown',
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
    // 植体, 牙根, 贴面, 嵌体,
    ['implant', 'trim', 'inlay', 'default'],
    // 基台, 牙根, 贴面, 嵌体,
    ['abutment', 'trim', 'inlay', 'default'],
    // 杆卡, 桥架
    ['lever_clamp', 'bridge'],
  ];

  // 添加状态
  if (tooth.state.includes(status)) {
    // 已有该状态
    console.log('已有状态', status);
    return;
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
        tooth.state = tooth.state.filter((item, index) => tooth.state.indexOf(item) === index);
        tooth.clash = tooth.clash.filter((item, index) => tooth.clash.indexOf(item) === index);

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
    tooth.clash = tooth.clash.filter((item, index) => tooth.clash.indexOf(item) === index);
  }
  console.log('tooth', tooth);

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
  const noToothRoot = ['abutment', 'implant'];
  // 显示已有状态和特殊状态
  tooth.state.forEach((s) => {
    tooth.findOne(`.${s}`).show();
    if (noToothRoot.includes(s) && !tooth.state.includes('crown')) {
      tooth.findOne('.default_crown').show();
    }
  });

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
  console.log('结果', state.data);
}

export { handleButtonEvent, handleToothEvent, setToothState };
