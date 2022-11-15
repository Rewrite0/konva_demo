/*global Konva*/
import { resPath, buttonStyle } from '../const.js';
// import { buttons as allButtons, onlyAbutment, onlyImplant } from './const.js';
import { buttonList } from './const.js';

/**
 * 创建button
 */
function createButton(el, index) {
  const gap = 10;
  const offsetX = 180 + gap;
  const offsetY = 64 + gap;

  const x = index < 5 ? index * offsetX : (index - 5) * offsetX;
  const y = index < 5 ? 0 : offsetY;

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
  });

  buttonGroup.add(box);

  /**
   * 按钮图标
   */
  const image = new Image();
  image.src = `${resPath}/buttonIcon/${el.id}.png`;
  image.onload = () => {
    const icon = new Konva.Image({
      image,
      x: 20,
      y: 64 / 2 - image.height / 2,
      width: image.width,
      heigth: image.height,
      listening: false,
    });

    buttonGroup.add(icon);

    /**
     * 按钮文本
     */
    const text = new Konva.Text({
      text: el.zhName,
      x: image.width + gap + 20,
      y: buttonStyle.height / 2 - 16 / 2,
      fill: '#fff',
      fontSize: 16,
      listening: false,
    });
    buttonGroup.add(text);
  };

  return buttonGroup;
}

/**
 * 创建button layer
 */
function createButtonLayer(state) {
  const buttonsLayer = new Konva.Layer({
    name: 'buttonLayer',
  });

  const buttons = buttonList(state);

  buttons.forEach((el, index) => {
    const buttonGroup = createButton(el, index);
    buttonsLayer.add(buttonGroup);
  });

  return buttonsLayer;
}

export { createButtonLayer };
