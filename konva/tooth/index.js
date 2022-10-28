/*global Konva*/
import { container } from '../const.js';

function createTooth(id) {
  const toothGroup = new Konva.Group({
    id: id,
    name: 'tooth',
    x: 0,
    y: 200,
  });

  toothGroup.ad(createToothTable());
}

function createToothTable() {
  const style = {
    width: 75,
    height: 520,
    colLine: {
      color: '#484c55',
      width: 1,
    },
    rowLine: {
      color: '#6b6f77',
      width: 2,
    },
    fontSize: 14,
    color: '#6a6f79',
  };

  const table = new Konva.Group({
    x: 0,
    y: 0,
    name: 'toothTable',
    width: container.width,
    height: style.height,
  });

  const line = new Konva.Line({
    point: [],
  });

  return table;
}
