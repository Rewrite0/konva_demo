/*global Konva*/
import { container } from '../const.js';
import { style, toothIdList } from './const.js';

/**
 * 创建tooth layer
 */
function createToothLayer() {
  const toothLayer = new Konva.Layer();

  // 添加表格
  toothLayer.add(createToothTable());
  // 添加牙齿组
  toothLayer.add(createToothGroup());

  return toothLayer;
}

/**
 * 创建牙齿组
 */
function createToothGroup() {
  const toothGroup = new Konva.Group({
    x: 0,
    y: style.offsetY,
    name: 'toothGroup',
    id: 'toothGroup',
    width: style.width * style.number,
    height: style.height,
  });

  // 添加tooth状态组
  let x, y;
  toothIdList.map((group, area) => {
    group.map((id, index) => {
      switch (area) {
        case 0: // 左上
          x = index * style.width;
          y = 0;
          break;
        case 1: // 右上
          x = (style.number / 2 + index) * style.width;
          y = 0;
          break;
        case 2: // 左下
          x = index * style.width;
          y = style.height / 2;
          break;
        case 3: // 右下
          x = (style.number / 2 + index) * style.width;
          y = style.height / 2;
          break;
      }

      const tooth = createToothStateGroup(id, x, y);
      toothGroup.add(tooth);
    });
  });

  return toothGroup;
}

/**
 * 创建牙齿状态组
 * @param {number} id 牙齿id
 */
function createToothStateGroup(id, x, y) {
  const toothStateGroup = new Konva.Group({
    id: `tooth-${id}`,
    name: 'tooth',
    x,
    y,
    width: style.width,
    height: style.height,
  });

  const toothId = new Konva.Text({
    text: id,
    x: 0,
    y: 230,
    width: style.width,
    align: 'center',
    fill: style.color,
    fontSize: style.fontSize,
  });
  toothStateGroup.add(toothId);

  // 状态group
  const stateGroup = new Konva.Group({
    name: 'state-group',
  });

  return toothStateGroup;
}

/**
 * 创建表格
 */
function createToothTable() {
  const table = new Konva.Group({
    x: 0,
    y: style.offsetY,
    name: 'toothTable',
    width: container.width,
    height: style.height,
  });

  const lineRow = new Konva.Line({
    points: [0, style.height / 2, style.width * style.number, style.height / 2],
    stroke: style.rowLine.color,
    strokeWidth: style.rowLine.width,
    listening: false,
  });
  table.add(lineRow);

  const lineCol = new Konva.Line({
    points: [(style.width * style.number) / 2, 0, (style.width * style.number) / 2, style.height],
    stroke: style.colLine.color,
    strokeWidth: style.colLine.width,
    listening: false,
  });
  table.add(lineCol);

  for (let i = 0; i <= style.number; i++) {
    const line = new Konva.Line({
      points: [i * style.width, 0, i * style.width, style.height],
      stroke: style.colLine.color,
      strokeWidth: 1,
      listening: false,
    });
    table.add(line);
  }

  return table;
}

export { createToothLayer };
