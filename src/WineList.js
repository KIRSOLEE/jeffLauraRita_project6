import React, { Component } from "react";
import { Link } from "react-router-dom";
import "animate.css/animate.min.css";

class WineList extends Component {
  constructor() {
    super();
    this.state = {
      wine: "",
      visible: 6
    };
  }
  loadMore() {
    this.setState(prev => {
      return { visible: prev.visible + 6 };
    });
  }
  click = () => {
    this.loadMore();
    this.props.displayWines();
  };
  render() {
    console.log(this.props.random);
    return (
      <div className="results">
        <div className="wrapper clearfix">
          {this.props.userChoice.slice(0, this.state.visible).map((item, i) => {
            // console.log(this.props.random)
            // console.log(item);
            return (
              <Link to={`/products/${item.id}`}>
                <div
                  key={item.id}
                  className="card wineChoice clearfix animated fadeInUp"
                >
                  <div className="cardWrapper clearfix">
                    <figure className="imageWrapper">
                      <img
                        src={item.imgURL}
                        onerror="this.style.display = &quot;none&quot;"
                        alt={item.name}
                      />
                    </figure>
                    <div className="cardSide">
                      <div className="wineTitle">
                        <h3>{item.name}</h3>
                      </div>{" "}
                      {/* closes wine title */}
                      <div className="winePriceWrapper">
                        <p className="winePrice">
                          {`${item.price}`}
                          <span>/bottle</span>
                        </p>
                      </div>
                      <button className="btn smallBtn">See Details</button>{" "}
                      {/* closes wine price wrapper */}
                    </div>{" "}
                    {/* closes card side */}
                  </div>{" "}
                  {/* closes card wrapper */}
                </div>{" "}
                {/* closes card */}
              </Link>
            );
          })}
        </div>
        <div className="wrapper">
          {this.state.visible < this.props.userChoice.length && (
            <div>
              <button className="btn" onClick={this.click}>
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default WineList;
