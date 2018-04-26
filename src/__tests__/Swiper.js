import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import React from 'react';

import Swiper from '../components/Swiper/Swiper';

Enzyme.configure({ adapter: new Adapter() });

describe('Swiper', () => {
  it('Корректно распознаёт и передаёт родителю жесты', () => {
    let gesture = '';
    const setGesture = (gestureName) => {
      gesture = gestureName;
    };
    const wrapper = mount(<Swiper setGesture={setGesture} style={{ width: 300, height: 300 }}/>);

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 100,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 150,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 151,
          clientY: 100,
        }
      ]
    });
    expect(gesture)
      .to
      .equal('HORIZONTAL_SWIPE');
    wrapper.simulate('touchEnd');

    gesture = '';

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 100,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 50,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 40,
          clientY: 100,
        }
      ]
    });
    expect(gesture)
      .to
      .equal('HORIZONTAL_SWIPE');
    wrapper.simulate('touchEnd');

    gesture = '';

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 100,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 100,
          clientY: 150,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 100,
          clientY: 100,
        }
      ]
    });
    expect(gesture)
      .to
      .equal('VERTICAL_SWIPE');

    wrapper.simulate('touchEnd');

    gesture = '';

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 100,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 100,
          clientY: 50,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 100,
          clientY: 40,
        }
      ]
    });
    expect(gesture)
      .to
      .equal('VERTICAL_SWIPE');
    wrapper.simulate('touchEnd');
  });

  it('Корректно выполняет все возможные свайпы, в том числе в пограничных условиях', () => {
    let swipeLeftCount = 0,
      swipeRightCount = 0,
      swipeUpCount = 0,
      swipeDownCount = 0;

    const swipeRight = () => swipeRightCount++,
      swipeLeft = () => swipeLeftCount++,
      swipeDown = () => swipeDownCount++,
      swipeUp = () => swipeUpCount++,
      wrapper = mount(
        <Swiper
          style={{ width: 300, height: 300 }}
          onSwipeUp={swipeUp}
          onSwipeDown={swipeDown}
          onSwipeLeft={swipeLeft}
          onSwipeRight={swipeRight}
        />
      );

    // Правый свайп

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 100,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 150,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 250,
          clientY: 100,
        }
      ]
    });

    wrapper.simulate('touchEnd');

    // Левый свайп

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 150,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 200,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 0,
          clientY: 100,
        }
      ]
    });

    wrapper.simulate('touchEnd');

    // Горизонтальный свайп на недостаточную для срабатывания величину

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 150,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 200,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 100,
          clientY: 100,
        }
      ]
    });

    wrapper.simulate('touchEnd');

    // Правый свайп с сильным уходом по вертикальной оси после определения жеста

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 100,
          clientY: 50,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 220,
          clientY: 50,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 230,
          clientY: 250,
        }
      ]
    });

    wrapper.simulate('touchEnd');

    // Нижний свайп (с сильным уходом вправо после определения жеста)

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 100,
          clientY: 50,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 100,
          clientY: 200,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 230,
          clientY: 250,
        }
      ]
    });

    wrapper.simulate('touchEnd');

    // Верхний свайп

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 150,
          clientY: 200,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 150,
          clientY: 50,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 0,
          clientY: 0,
        }
      ]
    });

    wrapper.simulate('touchEnd');

    // Невыясненное направление свайпа

    wrapper.simulate('touchStart', {
      touches: [
        {
          clientX: 150,
          clientY: 100,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 200,
          clientY: 150,
        }
      ]
    });
    wrapper.simulate('touchMove', {
      touches: [
        {
          clientX: 0,
          clientY: 100,
        }
      ]
    });

    wrapper.simulate('touchEnd');

    expect(swipeRightCount).to.equal(2);
    expect(swipeLeftCount).to.equal(1);
    expect(swipeDownCount).to.equal(1);
    expect(swipeUpCount).to.equal(1);
  })
});
