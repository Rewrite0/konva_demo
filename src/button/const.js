/**
 * button信息
 */
const buttons = [
  {
    id: 'button1',
    name: 'crown',
    zhName: '冠',
  },
  {
    id: 'button2',
    name: 'inlay',
    zhName: '嵌体',
  },
  {
    id: 'button3',
    name: 'implant',
    zhName: '内冠',
  },
  {
    id: 'button4',
    name: 'lever_clamp',
    zhName: '杆卡',
  },
  {
    id: 'button5',
    name: 'post_core',
    zhName: '桩核',
  },
  {
    id: 'button6',
    name: 'crown_bridge',
    zhName: '桥',
  },
  {
    id: 'button7',
    name: 'trim',
    zhName: '贴面',
  },
  {
    id: 'button8',
    name: 'abutment',
    zhName: '个性化基台',
  },
  {
    id: 'button9',
    name: 'bridge',
    zhName: '桥架',
  },
  {
    id: 'button10',
    name: 'clear_selected',
    zhName: '取消选中',
  },
];

/**
 * 仅基台
 */
const onlyAbutment = [
  {
    id: 'button8',
    name: 'abutment',
    zhName: '个性化基台',
  },
  {
    id: 'button10',
    name: 'clear_selected',
    zhName: '取消选中',
  },
];

/**
 * 仅植体
 */
const onlyImplant = [
  {
    id: 'button3',
    name: 'implant',
    zhName: '植体',
  },
  {
    id: 'button10',
    name: 'clear_selected',
    zhName: '清空选中',
  },
];

function buttonList(state) {
  if (state.onlyAbutment) {
    return onlyAbutment;
  } else if (state.onlyImplant) {
    return onlyImplant;
  } else {
    return buttons;
  }
}

export { buttonList };
