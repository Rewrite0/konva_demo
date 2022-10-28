/*global Konva*/
import 'https://cdn.bootcdn.net/ajax/libs/konva/8.3.13/konva.js';
import { container, resPath } from './const.js';
import { createButtonLayer } from './button/index.js';
import { createFinishLayer } from './finish/index.js';

class Tooth {
  /**
   * @param {object} options 创建选项
   */
  constructor(options) {
    this.stage = new Konva.Stage({
      container: 'app',
      ...container,
    });

    this.options = options;
  }

  init() {
    this.create();
  }

  create() {
    // 按钮区
    const buttonsLayer = createButtonLayer();
    // 牙位区
    // const toothsLayer = new Konva.Layer();
    // 完成操作区
    const finishLayer = createFinishLayer();

    this.stage.add(buttonsLayer);
    this.stage.add(finishLayer);
  }

  getData() {
    return this.state;
  }

  /**
   * 资源预加载
   */
  preload() {
    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 8; j++) {
        const src = `${resPath}/tooth/${i}${j}/`;
        const images = [
          src + 'default.png',
          src + 'default_crown.png',
          src + 'crown.png',
          src + 'only_crown.png',
          src + 'inlay.png',
          src + 'trim.png',
        ];

        images.forEach((src) => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          document.head.appendChild(link);
        });
      }
    }
  }
}

const app = new Tooth();
// app.preload();
app.init();

export { Tooth };
