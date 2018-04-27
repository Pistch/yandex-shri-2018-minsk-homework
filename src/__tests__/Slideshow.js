import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import React from 'react';

import { probe } from '../helpers';

import { TestSlideshow as Slideshow } from '../components/Slideshow/Slideshow';

Enzyme.configure({ adapter: new Adapter() });

describe('Slideshow', () => {
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
    },
    closeSlideshow = probe(),
    wrapper = mount(<Slideshow
      height={700}
      selectedPictureIndex={0}
      pictures={[]}
      loading={false}
      closeSlideshow={closeSlideshow}
      orientation
      mobile={false}
      fetchNext={() => {}}
      selectPicture={() => {}}
      picturesToLoad={5}
    />),
    selectPicture = probe(index => wrapper.setProps({ selectedPictureIndex: index })),
    fetchNextFn = fetchNext(wrapper);
  wrapper.setProps({
    fetchNext: fetchNextFn,
    selectPicture,
  });

  it('Получает картинки после вызова fetchNext', () => {
    fetchNextFn();

    expect(wrapper.prop('pictures')).to.deep.equal(newPictures);
  });

  it('Не переключает картинки назад, когда открыта первая', () => {
    const selectedPicture = wrapper.prop('selectedPictureIndex');
    wrapper.instance().previousPicture();

    expect(wrapper.prop('selectedPictureIndex')).to.equal(selectedPicture);
  });

  it('Переключает картинки вперёд', () => {
    const selectedPicture = wrapper.prop('selectedPictureIndex');
    wrapper.instance().nextPicture();

    expect(wrapper.prop('selectedPictureIndex')).to.equal(selectedPicture + 1);
  });

  it('Переключает картинки назад', () => {
    const selectedPicture = wrapper.prop('selectedPictureIndex');
    wrapper.instance().previousPicture();

    expect(wrapper.prop('selectedPictureIndex')).to.equal(selectedPicture - 1);
  });

  it('Не рендерит кнопку переключения назад при просмотре первой картинки', () => {
    expect(wrapper.find('button').length).to.equal(2);
  });

  it('Не переключает картинки вперёд, когда открыта последняя', () => {
    selectPicture(4);
    const selectedPicture = wrapper.prop('selectedPictureIndex');
    wrapper.instance().nextPicture();

    expect(wrapper.prop('selectedPictureIndex')).to.equal(selectedPicture);
  });

  it('Не рендерит кнопку переключения вперёд при просмотре последней картинки', () => {
    expect(wrapper.find('button').length).to.equal(2);
  });

  it('Рендерит кнопки переключения вперёд и назад при просмотре картинки из середины', () => {
    selectPicture(2);

    expect(wrapper.find('button').length).to.equal(3);
  });

  it('Закрывает слайдшоу по нажатию кнопки закрытия', () => {
    wrapper.find('button').last().simulate('click');

    expect(closeSlideshow(true)).to.equal(1);
  });

  it('Переключает картинку вперёд по нажатию кнопки', () => {
    const selectedPicture = wrapper.prop('selectedPictureIndex');
    wrapper.find('button').at(1).simulate('click');

    expect(wrapper.prop('selectedPictureIndex')).to.equal(selectedPicture + 1);
  });

  it('Переключает картинку назад по нажатию кнопки', () => {
    const selectedPicture = wrapper.prop('selectedPictureIndex');
    wrapper.find('button').first().simulate('click');

    expect(wrapper.prop('selectedPictureIndex')).to.equal(selectedPicture - 1);
  });

  it('Количество переданных в компонент картинок соответствует количеству отрендеренных слайдов', () => {
    expect(wrapper.find('.PictureContainer').length).to.equal(wrapper.prop('pictures').length);
  });

  it('Рендерит только 3 картинки одновременно, оставляя пустыми остальные слайды', () => {
    expect(wrapper.find('img[src=""]').length).to.equal(wrapper.prop('pictures').length - 3);
  });

  it(`Загружает дополнительные картинки,
    если до конца галереи их осталось меньше, чем количество загружаемых за раз`, () => {
      const initialPicturesQuantity = wrapper.prop('pictures').length;
      selectPicture(initialPicturesQuantity - 4);
      wrapper.instance().nextPicture();

      expect(wrapper.prop('pictures').length).to.equal(initialPicturesQuantity + 5);
    });

  it('Не загружает дополнительные картинки, если загрузка уже идёт', () => {
    const initialPicturesQuantity = wrapper.prop('pictures').length;
    wrapper.setProps({ loading: true });
    selectPicture(initialPicturesQuantity - 4);
    wrapper.instance().nextPicture();

    expect(wrapper.prop('pictures').length).to.equal(initialPicturesQuantity);
  });

  it('Рендерит индикатор загрузки на последнем слайде во время загрузки', () => {
    expect(wrapper.find('.PictureContainer').length).to.equal(wrapper.prop('pictures').length + 1);
  });
});
