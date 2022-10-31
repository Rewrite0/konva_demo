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
    console.log(this);
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

    // 其余button
    state.selected.forEach((id) => {
      const el = state.stage.findOne(`#${id}`);
      // console.log(el, name);
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
        strokeWidth: 1,
        opacity: 1,
      }).play();
      this.findOne('.tooth-box').stroke('rgba(56,113,227,1)');
    }
  });
}

/**
 * 设置tooth状态
 * @param {KonvaEl} tooth tooth el
 * @param {string} status 状态 - default, crown, default_crown, inlay, only_crown, trim, abutment, implant, post_core
 */
function setToothState(tooth, status) {
  const id = tooth.attrs.id;
  const group = tooth.findOne('.state-group');

  // 默认， 冠， 默认冠， 嵌体， 只有冠， 贴面
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
  // 个性化基台, 植体， 桩核
  const free = ['abutment', 'implant', 'post_core'];
  // 杆卡, 桥架, 冠桥
  const other = ['lever_clamp', 'bridge', 'crown_bridge'];

  all
    .filter((e) => e !== status)
    .forEach((name) => {
      console.log(name);
      group.findOne(`.${name}`).hide();
    });

  if (status == 'crown') {
    group.findOne(`.default`).show();
  }

  // 有基台或植体则没有牙根
  if (status == 'abutment' || status == 'implant') {
    all.forEach((e) => {
      group.findOne(`.${e}`).hide();
    });

    group.findOne(`.default_crown`).show();
  }

  group.findOne(`.${status}`).show();

  // state.data[status].push(id);
  state.data[status] = [...state.data[status], id];
  console.log('state data', state.data);
}

export { handleButtonEvent, handleToothEvent, setToothState };
