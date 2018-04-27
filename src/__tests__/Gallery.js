import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import React from 'react';

import { probe } from '../helpers';

import { TestGallery as Gallery } from '../components/Gallery/Gallery';

Enzyme.configure({ adapter: new Adapter() });

describe('Gallery', () => {
  const newPictures = [
      {
        width: 500,
        height: 700,
        name: 'karl-boran.jpg',
      },
      {
        width: 500,
        height: 700,
        name: 'karl-boran.jpg',
      },
      {
        width: 500,
        height: 700,
        name: 'karl-boran.jpg',
      },
      {
        width: 500,
        height: 700,
        name: 'karl-boran.jpg',
      },
      {
        width: 500,
        height: 700,
        name: 'karl-boran.jpg',
      },
    ],
    fetchNext = (wrapper) => {
      let count = 0;
      return function fetchNextPictures(showCount) {
        if (showCount === true) {
          return count;
        }
        count++;
        let pictures = [...wrapper.prop('pictures'), ...newPictures];
        wrapper.setProps({ pictures });
      };
    };

  describe('Независимые от размеров экрана кейсы', () => {
    let selectedPicture,
      pictureInTheMiddle;
    const selectPicture = probe((index) => { selectedPicture = index; }),
      openSlideshow = probe();

    const wrapper = mount(<Gallery
      width={320}
      height={640}
      mobile
      orientation
      pictures={[]}
      fetchNext={() => {}}
      selectPicture={selectPicture}
      openSlideshow={openSlideshow}
      picturesToLoad={5}
      loading={false}
    />);

    const fetchNextFn = fetchNext(wrapper);
    wrapper.setProps({ fetchNext: fetchNextFn });

    it('Получает картинки в пропы', () => {
      expect(wrapper.prop('pictures').length).to.equal(0);
    });

    it('Получает картинки по вызову fetchNext', () => {
      fetchNextFn();
      expect(wrapper.prop('pictures').length).to.equal(5);
    });

    it('Рендерит полученные картинки', () => {
      expect(wrapper.find('img').length).to.equal(wrapper.prop('pictures').length);
    });

    it('Вызывает функцию выбора картинок', () => {
      wrapper.find('img').first().simulate('click');
      expect(selectPicture(true)).to.equal(1);
    });

    it('Вызывает функцию открытия слайдшоу', () => {
      expect(openSlideshow(true)).to.equal(1);
    });

    it('Выбирает первую картинку', () => {
      expect(selectedPicture).to.equal(0);
    });

    it('Выбирает картинку из середины', () => {
      pictureInTheMiddle = wrapper.find('img').last();
      fetchNextFn();
      pictureInTheMiddle.simulate('click');
      expect(selectedPicture).to.equal(wrapper.prop('pictures').length - 6);
    });

    it('Выбирает последнюю картинку', () => {
      wrapper.find('img').last().simulate('click');
      expect(selectedPicture).to.equal(wrapper.prop('pictures').length - 1);
    });

    it('Загружает картинки по скроллу', () => {
      const picturesQuantityBefore = wrapper.prop('pictures').length;
      wrapper.instance().handleScroll();
      expect(picturesQuantityBefore < wrapper.prop('pictures').length).to.equal(true);
    });

    it('Не загружает картинки по скроллу, если загрузка уже идёт', () => {
      const picturesQuantityBefore = wrapper.prop('pictures').length;
      wrapper.setProps({ loading: true });
      wrapper.instance().handleScroll();
      expect(picturesQuantityBefore).to.equal(wrapper.prop('pictures').length);
    });
  });

  describe('Мобильная версия, вертикальная ориентация', () => {
    const wrapper = mount(<Gallery
      width={320}
      height={640}
      mobile
      orientation={false}
      pictures={[]}
      fetchNext={() => {}}
      selectPicture={() => {}}
      openSlideshow={() => {}}
      picturesToLoad={5}
      loading={false}
    />);

    const fetchNextFn = fetchNext(wrapper);
    wrapper.setProps({ fetchNext: fetchNextFn });

    it('Картинки рендерятся в столбец с вертикальной прокруткой', () => {
      fetchNextFn();
      expect(wrapper.first().getDOMNode().classList.contains('Vertical')).to.equal(true);
    });

    it('Ширина картинок соответсвует ширине экрана', () => {
      expect(parseInt(wrapper.children().children().first().getDOMNode().style.width, 10)).to.equal(320);
    });
  });

  describe('Мобильная версия, горизонтальная ориентация', () => {
    const wrapper = mount(<Gallery
      width={640}
      height={320}
      mobile
      orientation
      pictures={[]}
      fetchNext={() => {}}
      selectPicture={() => {}}
      openSlideshow={() => {}}
      picturesToLoad={5}
      loading={false}
    />);

    const fetchNextFn = fetchNext(wrapper);
    wrapper.setProps({ fetchNext: fetchNextFn });

    it('Картинки рендерятся в строку с горизонтальной прокруткой', () => {
      fetchNextFn();
      expect(wrapper.first().getDOMNode().classList.contains('Horizontal')).to.equal(true);
    });

    it('Высота картинок соответсвует высоте экрана', () => {
      expect(parseInt(wrapper.children().children().first().getDOMNode().style.height, 10)).to.equal(320);
    });
  });

  describe('Десктопная версия', () => {
    const wrapper = mount(<Gallery
      width={1280}
      height={720}
      mobile
      orientation
      pictures={[]}
      fetchNext={() => {}}
      selectPicture={() => {}}
      openSlideshow={() => {}}
      picturesToLoad={5}
      loading={false}
    />);

    const fetchNextFn = fetchNext(wrapper);
    wrapper.setProps({ fetchNext: fetchNextFn });

    it('Рендерит картинки построчно', () => {
      fetchNextFn();
      expect(wrapper.instance().splitRows().length).to.equal(1);
    });

    it('Разбивает на строки', () => {
      fetchNextFn();
      expect(wrapper.instance().splitRows().length).to.equal(2);
    });

    it('Высота строки зависит от её наполнения картинками', () => {
      const structure = wrapper.instance().splitRows();
      expect(structure[0].height < structure[1].height).to.equal(true);
    });

    it('Ширина строки не зависит от количества картинок в ней', () => {
      const structure = wrapper.instance().splitRows(),
        // Используются формулы вычисления из рендерящего метода
        width0 = structure[0]
          .pictures
          .reduce((val, item) => (val + ((structure[0].height / item.height) * item.width)), 0),
        width1 = structure[1]
          .pictures
          .reduce((val, item) => (val + ((structure[1].height / item.height) * item.width)), 0);
      // Следствие double precision, допускаем максимальную разницу в вычисленной ширине в 1px
      expect(Math.abs(width0 - width1) < 1).to.equal(true);
    });

    it('Высота строки зависит от ширины экрана', () => {
      fetchNextFn();
      fetchNextFn();
      fetchNextFn();
      fetchNextFn();
      const rowsQuantityBefore = wrapper.instance().splitRows().length;
      wrapper.setProps({ width: 1900 });

      expect(rowsQuantityBefore).to.not.equal(wrapper.instance().splitRows().length);
    });
  });
});
