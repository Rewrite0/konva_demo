/*global Konva*/
import 'https://cdn.bootcdn.net/ajax/libs/konva/8.3.13/konva.js';
import { container, resPath } from './const.js';
import { createButtonLayer } from './button/index.js';
import { createFinishLayer } from './finish/index.js';
import { createToothLayer } from './tooth/index.js';

class Tooth {
  /**
   * @param {object} options 创建选项{el,}
   * @param {string} options.el 容器id
   */
  constructor(options) {
    this.options = options;
  }

  init() {
    this.create();
  }

  create() {
    this.stage = new Konva.Stage({
      container: this.options.el,
      ...container,
    });

    // 按钮区
    const buttonsLayer = createButtonLayer();
    // 牙位区
    const toothsLayer = createToothLayer();
    // 完成操作区
    const finishLayer = createFinishLayer();

    this.stage.add(buttonsLayer);
    this.stage.add(finishLayer);
    this.stage.add(toothsLayer);
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

const app = new Tooth({
  el: 'app',
});
// app.preload();
app.init();

export { Tooth };
