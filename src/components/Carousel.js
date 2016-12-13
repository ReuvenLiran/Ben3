import React, { Component } from 'react';
import '../styles/Carousel.scss'

class Carousel extends Component {

  render () {
    return (

      <div id="myCarousel" className="carousel slide" data-ride="carousel">

        <ol className="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
          <li data-target="#myCarousel" data-slide-to="1"></li>
          <li data-target="#myCarousel" data-slide-to="2"></li>
          <li data-target="#myCarousel" data-slide-to="3"></li>
        </ol>


        <div className="carousel-inner" role="listbox">
          <div className="item active">
            <img src="http://societyofrock.com/wp-content/uploads/2016/11/metallica-live.jpg" alt="Chania" width="1000" height="1000"></img>
          </div>

          <div className="item">
            <img src="http://images1.laweekly.com/imager/u/original/7317884/nirvana-with-the-lights-out-cover.jpg" alt="Chania" width="1000" height="1000"></img>
          </div>

          <div className="item">
            <img src="http://rollingstoneaus.com/assets/Uploads/foo-fighters-cover-article.jpg" alt="Flower" width="1000" height="1000"></img>
          </div>

          <div className="item">
            <img src="http://images.popmatters.com/news_art/r/redhotchilipeppers-650.jpg" alt="Flower" width="1000" height="1000"></img>
          </div>
        </div>


        <div className="pointer">
          <div className="left-triangle"></div>
          <div className="right-triangle"></div>
        </div>

        <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next">
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>

    )
  }
}

export default Carousel;







