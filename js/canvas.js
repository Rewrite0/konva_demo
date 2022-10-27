import 'https://cdn.bootcdn.net/ajax/libs/konva/8.3.13/konva.js';

const stage = new Konva.Stage({
  container: 'app',
  width: 1200,
  height: 846
})

// 按钮区
const buttonsLayer = new Konva.Layer();
// 牙位区
const toothsLayer = new Konva.Layer();
// 完成操作区
const finishLayer = new Konva.Layer();

function createButton(id, x, y) {
  return {
    id,
    x,
    y,
    width: 180,
    height: 64,
    cornerRadius: 8,
    fill: '#383e4a',
  }
}

const buttons = [
  {
    id: 'button1',
    x: 0,
    y: 0
  }
]

for (let i = 0; i < 10; i++) {
  const offsetX = 180 + 10;
  const offsetY = 64 + 10;

  const x = i < 5 ? i * offsetX : (i - 5) * offsetX;
  const y = i < 5 ? 0 : offsetY;

  buttonsLayer.add(new Konva.Rect(createButton(`button${i + 1}`, x, y)));
}

stage.add(buttonsLayer);

const button1 = stage.findOne('#button1');

button1.on('click', (e) => {
  console.log('click', e);
})

button1.on('mouseover', (e) => {
  e.target.opacity(.5)
})

button1.on('mouseout', (e) => {
  e.target.opacity(1)
})