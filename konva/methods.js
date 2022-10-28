/*global Konva*/

/**
 * button hover事件
 * @param {KonvaEl} button button
 */
function buttonHover(button) {
  button.on('mouseenter', function () {
    this.opacity(0.7);
  });
  button.on('mouseleave', function () {
    this.opacity(1);
  });
  button.on('click', function () {
    this.opacity(0.3);
    const tween = new Konva.Tween({
      node: this,
      duration: 0.2,
      opacity: 0.7,
    });

    tween.play();
  });
}

export { buttonHover };
