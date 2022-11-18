/*global Konva*/
import { container } from '../const.js';
import { style, toothIdList } from './const.js';
import { resPath } from '../const.js';

/**
 * 创建tooth layer
 */
function createToothLayer() {
  const toothLayer = new Konva.Layer({
    name: 'toothLayer',
  });

  // 添加表格
  toothLayer.add(createToothTable());
  // 添加牙齿组
  toothLayer.add(createToothGroup());

  return toothLayer;
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

      const tooth = createToothStateGroup(area, id, x, y);
      toothGroup.add(tooth);
    });
  });

  return toothGroup;
}

/**
 * 创建牙齿状态组
 * @param {number} id 牙齿id
 */
function createToothStateGroup(area, id, x, y) {
  const toothStateGroup = new Konva.Group({
    id: `tooth-${id}`,
    name: 'tooth',
    x,
    y,
    width: style.width,
    height: style.height,
  });

  // 默认状态和冲突
  toothStateGroup.state = ['default'];
  toothStateGroup.clash = ['implant', 'abutment'];

  const rect = new Konva.Rect({
    name: 'tooth-box',
    x: 0,
    y: 0,
    width: style.width,
    height: style.height / 2,
    fill: 'rgba(0,0,0,0)',
    stroke: 'rgba(56,113,227,0.5)',
    strokeWidth: 0,
  });
  toothStateGroup.add(rect);

  const toothId = new Konva.Text({
    text: id,
    x: 0,
    y: area < 2 ? 230 : 18,
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

  // const state = {
  //   // 默认， 冠， 默认冠， 嵌体， 只有冠， 贴面
  //   fixed: ['default', 'crown', 'default_crown', 'inlay', 'only_crown', 'trim'],
  //   // 个性化基台, 植体， 桩核
  //   free: ['abutment', 'implant', 'post_core'],
  // };

  // 个性化基台图
  const abutmentImage = new Image();
  abutmentImage.src = `${resPath}/abutment.png`;

  // 植体图
  const implantImage = new Image();
  implantImage.src = `${resPath}/implant.png`;

  // 桩核
  const postCoreImage = new Image();
  postCoreImage.src = `${resPath}/post_core.png`;

  const imageY = () => {
    const offset = 90;
    if (area < 2) {
      return style.height / 2 - offset;
    } else {
      return offset;
    }
  };

  // 默认
  const defaultImage = new Image();
  defaultImage.src = `${resPath}/tooth/${id}/default.png`;
  defaultImage.onload = () => {
    const default_ = new Konva.Image({
      name: 'default',
      image: defaultImage,
      x: style.width / 2,
      y: imageY(),
      offset: {
        x: defaultImage.width / 2,
        y: area < 2 ? defaultImage.height : 0,
      },
      listening: false,
    });
    stateGroup.add(default_);
    default_.zIndex(0);
  };

  // 冠
  const crownImage = new Image();
  crownImage.src = `${resPath}/tooth/${id}/crown.png`;
  crownImage.onload = () => {
    const crown = new Konva.Image({
      name: 'crown',
      image: crownImage,
      x: style.width / 2,
      y: imageY(),
      offset: {
        x: crownImage.width / 2,
        y: area < 2 ? crownImage.height : 0,
      },
      listening: false,
    });
    stateGroup.add(crown);
    crown.hide();
  };

  // 贴面
  const trimImage = new Image();
  trimImage.src = `${resPath}/tooth/${id}/trim.png`;
  trimImage.onload = () => {
    const trim = new Konva.Image({
      name: 'trim',
      image: trimImage,
      x: style.width / 2,
      y: imageY(),
      offset: {
        x: trimImage.width / 2,
        y: area < 2 ? trimImage.height : 0,
      },
      listening: false,
    });
    stateGroup.add(trim);
    trim.hide();
  };

  // 嵌体
  const inlayImage = new Image();
  inlayImage.src = `${resPath}/tooth/${id}/inlay.png`;
  inlayImage.onload = () => {
    const inlay = new Konva.Image({
      name: 'inlay',
      image: inlayImage,
      x: style.width / 2,
      y: imageY(),
      offset: {
        x: inlayImage.width / 2,
        y: area < 2 ? inlayImage.height : 0,
      },
      listening: false,
    });
    stateGroup.add(inlay);
    inlay.hide();
  };

  // 只有冠
  const onlyCrownImage = new Image();
  onlyCrownImage.src = `${resPath}/tooth/${id}/only_crown.png`;
  onlyCrownImage.onload = () => {
    const onlyCrown = new Konva.Image({
      name: 'only_crown',
      image: onlyCrownImage,
      x: style.width / 2,
      y: imageY(),
      offset: {
        x: onlyCrownImage.width / 2,
        y: area < 2 ? onlyCrownImage.height : 0,
      },
      listening: false,
    });
    stateGroup.add(onlyCrown);
    onlyCrown.hide();
  };

  // 默认冠
  const defaultCrownImage = new Image();
  defaultCrownImage.src = `${resPath}/tooth/${id}/default_crown.png`;
  defaultCrownImage.onload = () => {
    const defaultCrown = new Konva.Image({
      name: 'default_crown',
      image: defaultCrownImage,
      x: style.width / 2,
      y: imageY(),
      offset: {
        x: defaultCrownImage.width / 2,
        y: area < 2 ? defaultCrownImage.height : 0,
      },
      listening: false,
    });
    stateGroup.add(defaultCrown);
    defaultCrown.hide();

    const startY = style.height / 2 - defaultCrownImage.height - 90;
    /**桩核y坐标 */
    const postCoreY = () => {
      if (area < 2) {
        return startY + 20;
      } else {
        return 90 + defaultCrownImage.height - 20;
      }
    };

    // 桩核
    const postCore = new Konva.Image({
      name: 'post_core',
      image: postCoreImage,
      x: style.width / 2,
      y: postCoreY(),

      offset: {
        x: postCoreImage.width / 2,
        y: postCoreImage.height,
      },
      listening: false,
    });
    stateGroup.add(postCore);
    postCore.hide();
    if (area >= 2) {
      postCore.rotate(180);
    }

    // 基台
    const abutment = new Konva.Image({
      name: 'abutment',
      image: abutmentImage,
      x: style.width / 2,
      y: postCoreY(),

      offset: {
        x: abutmentImage.width / 2,
        y: abutmentImage.height,
      },
      listening: false,
    });
    stateGroup.add(abutment);
    abutment.hide();
    if (area >= 2) {
      abutment.rotate(180);
    }

    const implantY = () => {
      if (area < 2) {
        return startY - 48;
      } else {
        return postCoreY() + abutmentImage.height + 6;
      }
    };
    // 植体
    const implant = new Konva.Image({
      name: 'implant',
      image: implantImage,
      x: style.width / 2,
      y: implantY(),

      offset: {
        x: implantImage.width / 2,
        y: implantImage.height,
      },
      listening: false,
    });
    stateGroup.add(implant);
    implant.hide();
    if (area >= 2) {
      implant.rotate(180);
    }
  };

  toothStateGroup.add(stateGroup);
  return toothStateGroup;
}

export { createToothLayer };
