import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import React from 'react';

import { probe } from '../helpers';

import KeyboardHandler from '../components/KeyboardHandler/KeyboardHandler';

Enzyme.configure({ adapter: new Adapter() });

describe('KeyboardHandler', () => {
  const arrowUp = probe(),
    arrowDown = probe(),
    arrowLeft = probe(),
    arrowRight = probe(),
    escape = probe();

  const wrapper = mount(<KeyboardHandler
    onArrowDown={arrowDown}
    onArrowRight={arrowRight}
    onArrowUp={arrowUp}
    onArrowLeft={arrowLeft}
    onEscape={escape}
    mockElem
  />);

  wrapper.simulate('keyup', { keyCode: 73 });
  wrapper.simulate('keyup', { keyCode: 37 });
  wrapper.simulate('keyup', { keyCode: 38 });
  wrapper.simulate('keyup', { keyCode: 39 });
  wrapper.simulate('keyup', { keyCode: 40 });
  wrapper.simulate('keyup', { keyCode: 27 });

  it('Обрабатывает нажатия стрелки вправо', () => {
    expect(arrowRight(true)).to.equal(1);
  });

  it('Обрабатывает нажатия стрелки влево', () => {
    expect(arrowLeft(true)).to.equal(1);
  });

  it('Обрабатывает нажатия стрелки вверх', () => {
    expect(arrowUp(true)).to.equal(1);
  });

  it('Обрабатывает нажатия стрелки вниз', () => {
    expect(arrowDown(true)).to.equal(1);
  });

  it('Обрабатывает нажатия "escape"', () => {
    expect(escape(true)).to.equal(1);
  });

  it('Обрабатывает нажатия с дополнительными клавишами', () => {
    wrapper.simulate('keyup', { keyCode: 27, ctrlKey: true });
    expect(escape(true)).to.equal(2);
  });
});
