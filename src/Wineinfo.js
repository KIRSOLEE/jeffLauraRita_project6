import React, { Component } from "react";
import Qs from "qs";
import axios from "axios";
import { Link } from "react-router-dom";
import firebase from "firebase";
import swal from "sweetalert";
import DisplayStock from "./DisplayStock";
import Nav from "./Nav";

const auth = firebase.auth();
const apiKey =
  "MDpmNWYxNDQzNi1iNjJmLTExZTgtYWViNS1kYjliZGU4ZDQ1ZjU6VTNrZTZOa0NPZ0xKd1RudFdWVFZQbGxYWlhnbW1obkk5NVo4";

class Wineinfo extends Component {
  constructor() {
    super();
    this.state = {
      wine: {},
      locations: {},
      latitude: "",
      longitude: "",
      nearbyStoreInfo: [],
      arrayOfStock: []
    };
  }

  // Setting State From Nav 
  appstate = user => {
    this.setState({
      user: user
    });
  };

  // Getting Location of User
  geolocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null
      });
      this.stores();
    });
  };

  // Sweet Alerts
  addToFavs = () => {
    swal(
      "Added To Your Cellar!",
      "Visit your cellar to see all your wines.",
      "success"
    );
    this.props.favourites(this.state.wine);
  };

  addToError = () => {
    swal(
      "Oops, you must log in!",
      "Please login to add to your cellar.",
      "error"
    );
  };

  // Getting Stores from Request
  stores = () =>
    axios({
      method: "GET",
      url: "https://proxy.hackeryou.com",
      dataResponse: "json",
      paramsSerializer: function(params) {
        return Qs.stringify(params, { arrayFormat: "brackets" });
      },
      params: {
        reqUrl: 'https://www.lcboapi.com/stores',
        params: {
          access_key: apiKey,
          per_page: 5,
          lat: `${this.state.latitude}`,
          lon: `${this.state.longitude}`,
        },
        proxyHeaders: {
          'Authorization': `Token "MDpmNWYxNDQzNi1iNjJmLTExZTgtYWViNS1kYjliZGU4ZDQ1ZjU6VTNrZTZOa0NPZ0xKd1RudFdWVFZQbGxYWlhnbW1obkk5NVo4"`
        }
      },
      xmlToJSON: false
    }).then(res => {
      const nearbyLocations = res.data.result;
      const nearbyStoreInfo = nearbyLocations.map(response => {
        return {
          storeId: response.id
        };
      });
      this.setState({ nearbyStoreInfo });
      const locationsWithStock = () =>
        this.state.nearbyStoreInfo.map(obj => {
          console.log(obj.storeId);
          const store = obj.storeId;
          return axios({
            method: "GET",
            url: "https://proxy.hackeryou.com",
            dataResponse: "json",
            paramsSerializer: function(params) {
              return Qs.stringify(params, { arrayFormat: "brackets" });
            },
            params: {
              reqUrl: `https://www.lcboapi.com/inventories`,
              params: {
                access_key: apiKey,
                store_id: `${store}`,
                product_id: `${this.props.match.params.wine_id}`
              },
              proxyHeaders: {
                Authorization: `Token "MDpmNWYxNDQzNi1iNjJmLTExZTgtYWViNS1kYjliZGU4ZDQ1ZjU6VTNrZTZOa0NPZ0xKd1RudFdWVFZQbGxYWlhnbW1obkk5NVo4"`
              }
            },
            xmlToJSON: false
          });
        });
      Promise.all(locationsWithStock()).then(res => {
        console.log(res);
        const filteredData = res
          .filter(store => {
            return store.data.result.length > 0;
          })
          .map(store => store.data);
        const arrayOfStock = filteredData.map(storeInfo => {
          return {
            storeName: storeInfo.store.name,
            storeId: storeInfo.store.id,
            stockAmount: storeInfo.result[0].quantity,
            storeAddress: storeInfo.store.address_line_1,
            storePhoneNumber: storeInfo.store.telephone
          };
        });
        console.log(arrayOfStock);
        this.setState({
          arrayOfStock
        });
        console.log(arrayOfStock);
      });
    });

  componentDidMount() {
    axios({
      method: "GET",
      url: "https://proxy.hackeryou.com",
      dataResponse: "json",
      paramsSerializer: function(params) {
        return Qs.stringify(params, { arrayFormat: "brackets" });
      },
      params: {
        reqUrl: `https://www.lcboapi.com/products/${
          this.props.match.params.wine_id
        }`,
        params: {
          access_key: apiKey,
          q: "wine",
          per_page: 40,
          where_not: "is_dead, is_discontinued"
        },
        proxyHeaders: {
          Authorization: `Token "MDpmNWYxNDQzNi1iNjJmLTExZTgtYWViNS1kYjliZGU4ZDQ1ZjU6VTNrZTZOa0NPZ0xKd1RudFdWVFZQbGxYWlhnbW1obkk5NVo4"`
        }
      },
      xmlToJSON: false
    }).then(res => {
      this.setState({
        wine: res.data.result
      });
    });
  }

  render() {
    return <div className="wineInfo clearfix">
        <Nav appstate={this.props.appstate} />
        <div className="wrapper">
          <figure className="imageWrapper">
            <img src={this.state.wine.image_url} alt={this.state.wine.name} />
          </figure>
          <div className="content">
            <div className="contentWrapper">
              <h1>{this.state.wine.name}</h1>
              {this.state.wine.price_in_cents == this.state.wine.regular_price_in_cents ? <div className="priceWrapper">
                  <p>
                    {`$${this.state.wine.price_in_cents / 100}`}
                    <span>/bottle</span>
                  </p>
                </div> : <div className="priceWrapper">
                  <p>
                    <span className="regular">{`$${(this.state.wine.regular_price_in_cents / 100).toFixed(2)}`}</span>
                    <span className="sale">{`$${(this.state.wine.price_in_cents / 100).toFixed(2)}`}</span>
                    <span className="bottle">/bottle</span>
                  </p>
                </div>}
              <p className="wineDescription">{`${this.state.wine.tasting_note}`}</p>
              <div className="wineServingSuggestBox">
                {this.state.wine.serving_suggestion !== null ? <div>
                    <p className="wineServingSuggestTitle">
                      Serving Suggestion
                    </p>
                    <p className="wineServingSuggest">{`${this.state.wine.serving_suggestion}`}</p>
                  </div> : null}
              </div>
              <ul>
                <li>
                  <span>Size: </span>
                  {`${this.state.wine.package_unit_volume_in_milliliters}mL`}
                </li>
                <li>
                  <span>Price Per Litre: </span>
                  {`$${(this.state.wine.price_per_liter_in_cents / 100).toFixed(2)}`}
                </li>
                <li>
                  <span>Alcohol/Vol: </span>
                  {`${this.state.wine.alcohol_content / 100}%`}
                </li>
              </ul>
              {this.props.user ? <button onClick={this.addToFavs} className="btn btnAlt">
                  <i class="fas fa-plus" /> Add to Cellar
                </button> : <button onClick={this.addToError} className="btn btnAlt">
                  <i class="fas fa-plus" /> Add to Cellar
                </button>}
              <button onClick={this.geolocation} className="btn">
                <i class="fas fa-map-marker-alt" /> Find near me
              </button>
            </div>
            {/* closes content wrapper */}
            {/* <DisplayStock arrayOfStock={this.state.arrayOfStock} /> */}
          </div>
          {/* closes content */}
          <DisplayStock arrayOfStock={this.state.arrayOfStock} />
        </div>
      </div>;
  }
}

export default Wineinfo;
