'use strict';

gemini.suite('Picture Gallery', (suite) => {
  suite
    .setUrl('/')
    .setCaptureElements('html')
    .capture('Галерея картинок', actions => actions.wait(20000))
    .capture('Слайдшоу, первая картинка', (actions, find) => {
      actions.click(find('img'));
      actions.wait(500);
    })
    .capture('Слайдшоу, вторая картинка', (actions, find) => {
      actions.sendKeys(gemini.ARROW_DOWN);
      actions.wait(500);
    })
});
