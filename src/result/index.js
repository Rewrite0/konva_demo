import { buttonStyle } from '../const.js';
import { container } from '../const.js';
import { toothName } from '../utils.js';

function createResultLayer(initData, state) {
  function createTitleBox(key) {
    const buttonGroup = new Konva.Group({
      name: 'result-box',
      x: 0,
      y: 0,
    });

    const box = new Konva.Rect({
      x: 0,
      y: 0,
      ...buttonStyle,
      fill: '#434a58',
    });

    buttonGroup.add(box);

    const name = new Konva.Text({
      text: toothName(key),
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
    buttonGroup.add(name);

    return buttonGroup;
  }

  function createList(data) {
    const fs = 16;
    const sx = 60;

    const group = new Konva.Group({
      name: 'tooth-list',
      width: container.width / 2 - buttonStyle.width,
      x: buttonStyle.width,
      y: 0,
    });

    const title = new Konva.Text({
      text: '牙位',
      width: sx,
      height: buttonStyle.height,
      x: 0,
      y: 0,
      fill: '#fff',
      fontSize: fs,
      align: 'center',
      verticalAlign: 'middle',
      listening: false,
    });

    group.add(title);

    const createTooth = (toothId, index, number) => {
      const id = toothId.match(/\d+/g);
      // 0开始
      const row = Math.ceil((index + 1) / 8) - 1;
      const newIndex = index - row * 8;

      const size = {
        width: 34,
        height: 34,
      };

      const boxY = () => {
        let y, space;
        if (number > 8) {
          y = 0;
          space = size.height + 10;
        } else {
          y = (buttonStyle.height - size.height) / 2;
          space = buttonStyle.height - y;
        }

        return row * space + y;
      };

      const box = new Konva.Group({
        name: 'id',
        ...size,
        x: sx + (size.width + 10) * newIndex,
        y: boxY(),
      });

      const t = new Konva.Text({
        text: id,
        ...size,
        x: 0,
        y: 0,
        fill: '#fff',
        fontSize: fs,
        align: 'center',
        verticalAlign: 'middle',
        listening: false,
      });
      box.add(t);

      const circle = new Konva.Circle({
        ...size,
        x: size.width / 2,
        y: size.height / 2,
        stroke: 'rgba(255, 255, 255, 0.5)',
        strokeWidth: 1,
      });

      box.add(circle);

      return box;
    };

    data.map((toothId, index) => {
      const id = createTooth(toothId, index, data.length);
      group.add(id);
    });

    return group;
  }

  let space = 20;
  function createResultItem(key, data, index) {
    const startY = 780;
    const x = index % 2 == 1 ? 0 : container.width / 2;
    // 0 开始
    const row = Math.ceil(index / 2) - 1;
    const number = data.length;

    const rowNum = Math.ceil(number / 8);
    const nspace = 20 + (rowNum - 1) * 30;
    space = space > nspace ? space : nspace;

    const y = startY + row * (buttonStyle.height + space);
    console.log('show y', space);

    const item = new Konva.Group({
      name: 'result-item',
      width: container.width / 2,
      height: buttonStyle.height,
      x,
      y,
    });

    const titleBox = createTitleBox(key);
    item.add(titleBox);

    const list = createList(data);
    item.add(list);

    return item;
  }

  const layer = new Konva.Layer({
    name: 'resultLayer',
  });

  let index = 1;
  for (const key in initData) {
    const data = initData[key];
    const item = createResultItem(key, data, index);
    layer.add(item);

    index++;
  }

  state.resultItemSpace = space;

  return layer;
}

export { createResultLayer };
