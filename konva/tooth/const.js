const style = {
  number: 16,
  width: 75,
  height: 520,
  // id文本偏移量
  offsetY: 200,
  colLine: {
    color: '#484c55',
    width: 2,
  },
  rowLine: {
    color: '#6b6f77',
    width: 2,
  },
  fontSize: 14,
  color: '#6a6f79',
};

/**
 * tooth id list
 */
const toothIdList = [
  // 左上
  [18, 17, 16, 15, 14, 13, 12, 11],
  // 右上
  [21, 22, 23, 24, 25, 26, 27, 28],
  // 左下
  [48, 47, 46, 45, 44, 43, 42, 41],
  // 右下
  [31, 32, 33, 34, 35, 36, 37, 38],
];

export { style, toothIdList };
