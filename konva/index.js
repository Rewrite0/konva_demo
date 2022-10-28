/*global Konva*/
import 'https://cdn.bootcdn.net/ajax/libs/konva/8.3.13/konva.js';
import { container } from './const.js';
import { createButtonLayer } from './button/index.js';
import { createFinishLayer } from './finish/index.js';

const stage = new Konva.Stage({
  container: 'app',
  ...container,
});

// 按钮区
const buttonsLayer = createButtonLayer();
// 牙位区
// const toothsLayer = new Konva.Layer();
// 完成操作区
const finishLayer = createFinishLayer();

stage.add(buttonsLayer);
stage.add(finishLayer);
