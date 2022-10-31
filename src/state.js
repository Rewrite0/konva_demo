// /*global Konva*/

/**
 * app状态
 */
const state = new Proxy(
  {
    // Konva实例
    stage: null,
    // 选中列表
    selected: [],
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
      console.log('set', target, key, val);
      target[key] = val;
      return true;
    },
  }
);

export { state };
