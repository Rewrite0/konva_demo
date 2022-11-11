/*global Konva*/
import 'https://cdn.bootcdn.net/ajax/libs/konva/8.3.13/konva.js';
import { container } from './const.js';
import { createButtonLayer } from './button/index.js';
import { createFinishLayer } from './finish/index.js';
import { createToothLayer } from './tooth/index.js';
import { state } from './state.js';
import { resetToothGroup, clearSelected } from './methods.js';

class Tooth {
  /**
   * @param {object} options 创建选项{el,}
   * @param {string} options.el 容器id
   */
  constructor(options) {
    this.options = options;

    if (options.listening == false) {
      state.listening = options.listening;
    }

    this.stage = new Konva.Stage({
      container: this.options.el,
      ...container,
    });

    state.stage = this.stage;
  }

  init(callback) {
    this.create();
    typeof callback == 'function' && callback(this);
  }

  create() {
    // 按钮区
    const buttonsLayer = createButtonLayer();
    // 牙位区
    const toothsLayer = createToothLayer();
    // 完成操作区
    const finishLayer = createFinishLayer();

    if (this.options.buttonsLayer !== false) {
      this.stage.add(buttonsLayer);
    }
    if (this.options.finishLayer !== false) {
      this.stage.add(finishLayer);
    }

    this.stage.add(toothsLayer);
  }

  getData() {
    return state.data;
  }

  toImage() {
    clearSelected();
    return this.stage.toDataURL({ pixelRatio: 1 });
  }

  downloadImage() {
    function downloadURI(uri, name) {
      var link = document.createElement('a');
      link.download = name;
      link.href = uri;
      link.click();
    }

    downloadURI(this.toImage(), 'stage.png');
  }

  on(event, func) {
    state.on[event] = func;
  }

  reset() {
    resetToothGroup();
  }
}

const app = new Tooth({
  el: 'app',
  // listening: false,
  // finishLayer: false,
  // buttonsLayer: false,
});

app.init();

export { Tooth };
