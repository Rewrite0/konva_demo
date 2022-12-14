// /*global Konva*/
import { buttons } from './button/const.js';

/**
 * app状态
 */
const state = new Proxy(
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
      // 内冠桥
      inner_crown_bridge: [],
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

export { state };
