/*global Konva*/
import { container, buttonColor } from '../const.js';
import { buttonStyle } from '../const.js';
import { buttons } from './const.js';

/**
 * 创建button
 */
function createButton(el, index) {
  const gap = 10;
  const x = container.width - (index + 1) * buttonStyle.width - index * gap;
  const y = container.height - buttonStyle.height;

  /**
   * 按钮组
   */
  const buttonGroup = new Konva.Group({
    id: el.id,
    name: el.name,
    x,
    y,
  });

  /**
   * 按钮box
   */
  const box = new Konva.Rect({
    x: 0,
    y: 0,
    ...buttonStyle,
    fill: el.name == 'finish' ? buttonColor.confirm : buttonColor.normal,
  });

  buttonGroup.add(box);

  /**
   * 按钮文本
   */
  const text = new Konva.Text({
    text: el.zhName,
    x: 0,
    y: 0,
    width: buttonStyle.width,
    height: buttonStyle.height,
    fill: '#fff',
    fontSize: 18,
    align: 'center',
    verticalAlign: 'middle',
    listening: false,
  });
  buttonGroup.add(text);

  return buttonGroup;
}

/**
 * 创建button layer
 */
function createFinishLayer() {
  const buttonLayer = new Konva.Layer({
    name: 'finishLayer',
  });

  buttons.forEach((el, index) => {
    const buttonGroup = createButton(el, index);
    buttonLayer.add(buttonGroup);
  });

  return buttonLayer;
}

export { createFinishLayer };
