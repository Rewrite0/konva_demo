/*global Konva*/
import 'https://cdn.bootcdn.net/ajax/libs/konva/8.3.13/konva.js';
import { container } from './const.js';
import { buttonStyle } from './const.js';
import { buttons as finishButtons } from './finish/const.js';
import { buttonList } from './button/const.js';
import { createButtonLayer } from './button/index.js';
import { createFinishLayer } from './finish/index.js';
import { createToothLayer } from './tooth/index.js';
import { createResultLayer } from './result/index.js';
import {
  resetToothGroup,
  updateData,
  handleButtonEvent,
  handleToothEvent,
  clearSelected,
  setToothState,
} from './methods.js';

class Tooth {
  /**
   * @param {object} options 创建选项{el,}
   * @param {string} options.el 容器id
   */
  constructor(options) {
    this.options = options;
  }

  init(callback) {
    this.initState();

    this.stage = new Konva.Stage({
      container: this.options.el,
      ...container,
    });

    this.state.stage = this.stage;
    this.initData = null;
    if (this.options.init) {
      this.initData = JSON.parse(this.options.init);
    }
    this.create();

    let timer = setInterval(() => {
      let number = 298;
      if (this.options.onlyAbutment || this.options.onlyImplant) {
        number = 290;
      }

      if (this.stage.find('Image').length == number) {
        clearInterval(timer);
        timer = null;
        this.setInitData();
        typeof callback == 'function' && callback(this);
      }
    }, 200);
  }

  setInitData() {
    if (this.options.init) {
      const data = this.initData;
      let newData = {};

      for (const key in data) {
        if (data[key].length !== 0) {
          newData[key] = data[key];
        }
      }

      if (newData !== {}) {
        for (const key in newData) {
          if (['lever_clamp', 'bridge', 'crown_bridge'].includes(key)) {
            this.state.selected = newData[key];
            const button = this.stage.findOne(`.${key}`);
            button.fire('click');
            this.clearSelected();
          } else {
            for (const id of newData[key]) {
              const tooth = this.stage.findOne(`#${id}`);
              setToothState(this.state, tooth, key);
            }
          }
        }
      }
    }
  }

  /**
   * 初始化state
   */
  initState() {
    this.state = new Proxy(
      {
        // Konva实例
        stage: null,
        // 选中列表
        selected: [],
        // 事件监听
        listening: true,
        // 监听函数
        on: {},
        // 结果
        data: {
          // 牙冠
          crown: [],
          // 嵌体
          inlay: [],
          // 植体
          implant: [],
          // 杆卡
          lever_clamp: [],
          // 桩核
          post_core: [],
          // 冠桥
          crown_bridge: [],
          // 贴面
          trim: [],
          // 基台
          abutment: [],
          // 桥架
          bridge: [],
        },
      },
      {
        get(target, key) {
          return target[key];
        },
        set(target, key, val) {
          target[key] = val;

          console.log('change', key);

          const selected = target.selected;

          if (target.stage !== null) {
            const buttons = target.app.buttons;
            // 按钮样式初始化
            buttons.forEach(({ name }) => {
              const btn = target.stage.findOne(`.${name}`);
              if (btn) {
                btn.opacity(1);
              }
            });

            selected.forEach((id) => {
              const tooth = target.stage.findOne(`#${id}`);

              tooth.state.forEach((status) => {
                if (status == 'default') return;
                const btn = target.stage.findOne(`.${status}`);
                btn.opacity(0.5);
              });
            });
          }

          return true;
        },
      }
    );

    this.state.app = this;

    if (this.options.listening == false) {
      this.state.listening = this.options.listening;
    }

    if (this.options.onlyAbutment) {
      this.state.onlyAbutment = this.options.onlyAbutment;
    }

    if (this.options.onlyImplant) {
      this.state.onlyImplant = this.options.onlyImplant;
    }

    const buttons = buttonList(this.state);
    this.buttons = [...buttons, ...finishButtons];
  }

  /**
   * 创建Layer
   */
  create() {
    const bgLayer = new Konva.Layer({
      name: 'background',
    });

    const bg = new Konva.Rect({
      name: 'bg',
      x: 0,
      y: 0,
      width: container.width,
      // height: container.height,
      height: 3000,
      fill: '#2d313a',
    });

    bg.on('click tap', () => {
      this.clearSelected();
    });

    bgLayer.add(bg);
    this.stage.add(bgLayer);

    // 按钮区
    const buttonsLayer = createButtonLayer(this.state);
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

    if (this.initData) {
      const resultLayer = createResultLayer(this.initData, this.state);
      this.stage.add(resultLayer);
      resultLayer.hide();
    }

    this.handleEvent();
  }

  handleEvent() {
    this.buttons.map((el) => {
      const name = el.name;
      const button = this.stage.findOne(`.${name}`);
      handleButtonEvent(this.state, button);
    });

    const tooths = this.stage.find('.tooth');
    tooths.map((el) => {
      handleToothEvent(this.state, el);
    });
  }

  /**
   * 获取data
   * @returns data
   */
  getData() {
    return this.state.data;
  }

  /**
   * 保存数据
   * @param {string} key 保存的key
   */
  saveData(key = 'data') {
    const data = this.getData();
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * 清除选中
   */
  clearSelected() {
    clearSelected(this.state);
  }

  /**
   * 生成图片
   * @returns image url
   */
  toImage() {
    this.clearSelected();

    const space = this.state.resultItemSpace;
    const number = Object.keys(this.initData).length;
    const newHeight =
      this.stage.height() +
      Math.ceil(number / 2) * (buttonStyle.height + space) -
      buttonStyle.height;
    this.stage.height(newHeight);

    this.stage.findOne('.finishLayer').hide();
    this.stage.findOne('.resultLayer').show();

    console.log('space', this.state.resultItemSpace, space);

    const image = this.stage.toDataURL({ pixelRatio: 1 });
    this.stage.findOne('.finishLayer').show();
    this.stage.findOne('.resultLayer').hide();
    this.stage.height(container.height);

    return image;
  }

  /**
   * 下载生成的图片
   */
  downloadImage() {
    function downloadURI(uri, name) {
      var link = document.createElement('a');
      link.download = name;
      link.href = uri;
      link.click();
    }

    downloadURI(this.toImage(), 'stage.png');
  }

  /**
   * 监听按钮事件
   * @param {string} event cancel, finish
   * @param {function} func func
   */
  on(event, func) {
    this.state.on[event] = func;
  }

  /**
   * 重置状态
   */
  reset() {
    resetToothGroup(this.state);
  }

  /**
   * 更新数据
   * @param {string} id tooth id
   */
  update(id) {
    updateData(this.state, id);
  }
}

export { Tooth };
