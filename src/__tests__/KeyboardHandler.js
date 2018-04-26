import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import React from 'react';

import KeyboardHandler from '../components/KeyboardHandler/KeyboardHandler';

Enzyme.configure({ adapter: new Adapter() });

describe('KeyboardHandler', () => {
  it('Правильно вызывает функции по нажатию клавиш', () => {
    const probe = () => {
        let count = 0;

        return (returnCount) => {
          if (returnCount) {
            return count;
          } else {
            count++;
          }
        }
      },
      arrowUp = probe(),
      arrowDown = probe(),
      arrowLeft = probe(),
      arrowRight = probe(),
      escape = probe();

    const wrapper = mount(
      <KeyboardHandler
        onArrowDown={arrowDown}
        onArrowRight={arrowRight}
        onArrowUp={arrowUp}
        onArrowLeft={arrowLeft}
        onEscape={escape}
        mockElem
      />
    );

    wrapper.simulate('keyup', { keyCode: 37 });
    wrapper.simulate('keyup', { keyCode: 38 });
    wrapper.simulate('keyup', { keyCode: 39 });
    wrapper.simulate('keyup', { keyCode: 73 });
    wrapper.simulate('keyup', { keyCode: 40 });
    wrapper.simulate('keyup', { keyCode: 27 });
    wrapper.simulate('keyup', { keyCode: 27, ctrlKey: true });
    
    expect(arrowUp(true)).to.equal(1);
    expect(arrowDown(true)).to.equal(1);
    expect(arrowLeft(true)).to.equal(1);
    expect(arrowRight(true)).to.equal(1);
    expect(escape(true)).to.equal(2);
  });
});
