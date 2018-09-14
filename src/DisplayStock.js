import React, { Component } from "react";

class DisplayStock extends Component {
  render() {
    return (
      <div className="displayStock">
      <div className="wrapper">
        {this.props.arrayOfStock.map(store => {
          return (
            <div className="card stockCard">
            <div className="storeInfo" key={store.storeId}>
              <h3>{store.storeName} LCBO</h3>
              <p>
                {store.stockAmount} bottles available
              </p>
              <p>
                <span>Address: </span>
                <a href={`https://www.google.ca/maps/place/${store.storeAddress}`} target="_blank">
                  {store.storeAddress}
                </a>
              </p>
              <p>
                <span>Phone Number: </span>
                <a href={`tel:${store.storeAddress}`}>
                  {store.storePhoneNumber}
                </a>
              </p>
            </div>
            </div>
          );
        })}
        </div>
      </div>
    );
  }
}

export default DisplayStock;
