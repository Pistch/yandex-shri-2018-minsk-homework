import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import React from 'react';

import { probe } from '../helpers';

import GalleryItem from '../components/GalleryItem/GalleryItem';

Enzyme.configure({ adapter: new Adapter() });

describe('GalleryItem', () => {
  it('Имеет размеры по умолчанию', () => {
    const wrapper = mount(<GalleryItem pictureUrl="omgomg" />);

    expect(wrapper.find('div').getDOMNode().getAttribute('style'))
      .to
      .equal('height: 100px; width: 100px;');
  });

  it('Корректно получает размеры', () => {
    const wrapper = mount(<GalleryItem pictureUrl="omgomg" height={200} width={200} />);

    expect(wrapper.find('div').getDOMNode().getAttribute('style'))
      .to
      .equal('height: 200px; width: 200px;');
  });

  it('Правильно высталяет УРЛ картинки', () => {
    const wrapper = mount(<GalleryItem pictureUrl="datPictureSource" />);

    expect(wrapper.find('img').getDOMNode().getAttribute('src'))
      .to
      .equal('datPictureSource');
  });

  it('Вызывет обработчик клика', () => {
    const clickFunc = probe(),
      wrapper = mount(<GalleryItem pictureUrl="omgomg" onClick={clickFunc} />);

    wrapper.simulate('click');

    expect(clickFunc(true))
      .to
      .equal(1);
  });
});
