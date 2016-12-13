import React, { Component } from 'react';
import Carousel from './Carousel'
import carouselSlider from './carouselSlider'

class viewManager extends Component {

  render () {
    return (
      <div>
        <Carousel />
        <carouselSlider />
      </div>
    )
  }
}

export default viewManager;
