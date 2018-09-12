import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import Qs from "qs";
import Form from "./Form";
import Header from "./Header";
import Footer from "./Footer";
import WineList from "./WineList";
import Wineinfo from "./Wineinfo";
import SavedList from "./SavedList";
import _ from "lodash";
import firebase from "firebase";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const apiUrl = "http://www.lcboapi.com/products";
const apiKey =
  "MDoxM2NjMDdlNC1iMDgwLTExZTgtYTc1NS0wYjUyYWEyN2NiMzM6TGVSYzFIVmJaMVEySE5rem1RdURPTFdGYnFKYTdZeHpkTVRi";
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
// const dbRef = firebase.database().ref(/User/`${this.state.user.uid}`);

// Comment //

class App extends Component {
  constructor() {
    super();
    this.state = {
      wineArray: [],
      wineInfo: [],
      colour: "all",
      price: "$",
      $all: [],
      $$all: [],
      $$$all: [],
      $$$$all: [],
      $white: [],
      $red: [],
      $$white: [],
      $$red: [],
      $$$white: [],
      $$$red: [],
      $$$$white: [],
      $$$$red: [],
      random: [],
      user: null,
      userChoice: []
    };
  }

  getWine = pageNumber => {
    return axios({
      method: "GET",
      url: "http://proxy.hackeryou.com",
      dataResponse: "json",
      paramsSerializer: function(params) {
        return Qs.stringify(params, { arrayFormat: "brackets" });
      },
      params: {
        reqUrl: apiUrl,
        params: {
          // key: apiKey,
          q: "wine",
          page: pageNumber,
          per_page: 40,
          where_not: "is_dead, is_discontinued",
        },
        proxyHeaders: {
          'Authorization': `Token ${apiKey}`
        },
        xmlToJSON: false
      }
    });
  };

  handleChangePrice = e => {
    this.setState({
      price: e.target.id
    });
  };

  handleChangeColour = e => {
    this.setState({
      colour: e.target.id
    });
  };

  appstate = user => {
    this.setState({
      user: user
    })
  };

  favourites = wine => {
    this.dbref.push({
      Wines: wine
    });
  };

  displayWines = () => {
    const userChoice = `${this.state.price}${this.state.colour}`;
    const totalChoice = this.state[`${userChoice}`];
    const random = _.sampleSize(this.state[`${userChoice}`], 6);
    // console.log(random);
    console.log("clicked");
    this.setState({
      random,
      userChoice: totalChoice
    });
  };

  sortWine = selectedWine => {
    const winesArray = Object.entries(selectedWine || {}).map(item => {
      // console.log(item)
      return {
        wineKey: item[0],
        wineImage: item[1].Wines.image_url,
        wineName: item[1].Wines.name,
        wineId: item[1].Wines.id
      };
    });
    this.setState({
      wineInfo: winesArray
    });
    // console.log(this.state.wineInfo)
  };

  deleteWine = wineId => {
    // Delete from Firebase
    console.log(wineId);
    const wineiddbref = firebase
      .database()
      .ref(`${this.state.user.uid}/${wineId}`);
    wineiddbref.remove();
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState(
          {
            user
          },
          () => {
            this.dbref = firebase.database().ref(this.state.user.uid);
            this.dbref.on("value", snapshot => {
              // if (this.dbref.child !== null) {
              this.sortWine(snapshot.val());
              // }
              // if (snapshot.val()) {
              // }
              // console.log(snapshot.val())
            });
          }
        );
      }
    });
    const wineRequests = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
      this.getWine
    );
    Promise.all(wineRequests).then(responses => {
      responses = responses
        .map(response => {
          return response.data.result;
        })
        .reduce((acc, curr) => {
          return [...acc, ...curr];
        })
        .filter(item => {
          return (
            item.name !==
              "Castelli del Grevepesa Castelgreve Chianti Classico 2016" &&
            item.price_in_cents < 2200 &&
            item.package_unit_volume_in_milliliters === 750 &&
            item.package_unit_type === "bottle"
          );
        });
      this.setState(
        {
          wineArray: responses
        },
        () => {
          const fullArray = this.state.wineArray;

          const $all = fullArray
            .filter(item => {
              return item.price_in_cents > 600 && item.price_in_cents < 1000;
            })
            .map(response => {
              return {
                id: response.id,
                colour: response.secondary_category,
                name: response.name,
                price: `$${(response.price_in_cents / 100).toFixed(2)}`,
                imgURL: response.image_url,
                thumb: response.image_thumb_url,
                onSale: response.has_limited_time_offer
                // sale: `$${response.regular_price_in_cents / 100}`
              };
            });
          const userChoice = fullArray
            .filter(item => {
              return item.price_in_cents > 600 && item.price_in_cents < 1000;
            })
            .map(response => {
              return {
                id: response.id,
                colour: response.secondary_category,
                name: response.name,
                price: `$${(response.price_in_cents / 100).toFixed(2)}`,
                imgURL: response.image_url,
                thumb: response.image_thumb_url,
                onSale: response.has_limited_time_offer
                // sale: `$${response.regular_price_in_cents / 100}`
              };
            });
          const $$all = fullArray
            .filter(item => {
              return item.price_in_cents > 1000 && item.price_in_cents < 1400;
            })
            .map(response => {
              return {
                id: response.id,
                colour: response.secondary_category,
                name: response.name,
                price: `$${(response.price_in_cents / 100).toFixed(2)}`,
                imgURL: response.image_url,
                thumb: response.image_thumb_url,
                onSale: response.has_limited_time_offer
                // sale: `$${response.regular_price_in_cents / 100}`
              };
            });
          const $$$all = fullArray
            .filter(item => {
              return item.price_in_cents > 1400 && item.price_in_cents < 1800;
            })
            .map(response => {
              return {
                id: response.id,
                colour: response.secondary_category,
                name: response.name,
                price: `$${(response.price_in_cents / 100).toFixed(2)}`,
                imgURL: response.image_url,
                thumb: response.image_thumb_url,
                onSale: response.has_limited_time_offer
                // sale: `$${response.regular_price_in_cents / 100}`
              };
            });
          const $$$$all = fullArray
            .filter(item => {
              return item.price_in_cents > 1800 && item.price_in_cents < 2200;
            })
            .map(response => {
              // console.log(response)
              return {
                id: response.id,
                colour: response.secondary_category,
                name: response.name,
                price: `$${(response.price_in_cents / 100).toFixed(2)}`,
                imgURL: response.image_url,
                thumb: response.image_thumb_url,
                onSale: response.has_limited_time_offer
                // sale: `$${response.regular_price_in_cents / 100}`
              };
            });
          this.setState(
            {
              $all,
              $$all,
              $$$all,
              $$$$all,
              userChoice
            },
            () => {
              const $ = this.state.$all;
              const $$ = this.state.$$all;
              const $$$ = this.state.$$$all;
              const $$$$ = this.state.$$$$all;

              const $white = $.filter(item => {
                return item.colour === "White Wine";
              }).map(response => {
                return {
                  id: response.id,
                  colour: response.colour,
                  name: response.name,
                  price: response.price,
                  imgURL: response.imgURL,
                  thumb: response.thumb,
                  // sale: response.sale,
                  onSale: response.onSale
                };
              });

              const $red = $.filter(item => {
                return item.colour === "Red Wine";
              }).map(response => {
                return {
                  id: response.id,
                  colour: response.colour,
                  name: response.name,
                  price: response.price,
                  imgURL: response.imgURL,
                  thumb: response.thumb,
                  // sale: response.sale,
                  onSale: response.onSale
                };
              });

              const $$red = $$.filter(item => {
                return item.colour === "Red Wine";
              }).map(response => {
                return {
                  id: response.id,
                  colour: response.colour,
                  name: response.name,
                  price: response.price,
                  imgURL: response.imgURL,
                  thumb: response.thumb,
                  // sale: response.sale,
                  onSale: response.onSale
                };
              });

              const $$white = $$.filter(item => {
                return item.colour === "Red Wine";
              }).map(response => {
                return {
                  id: response.id,
                  colour: response.colour,
                  name: response.name,
                  price: response.price,
                  imgURL: response.imgURL,
                  thumb: response.thumb,
                  // sale: response.sale,
                  onSale: response.onSale
                };
              });

              const $$$white = $$$.filter(item => {
                return item.colour === "White Wine";
              }).map(response => {
                return {
                  id: response.id,
                  colour: response.colour,
                  name: response.name,
                  price: response.price,
                  imgURL: response.imgURL,
                  thumb: response.thumb,
                  // sale: response.sale,
                  onSale: response.onSale
                };
              });

              const $$$red = $$$.filter(item => {
                return item.colour === "Red Wine";
              }).map(response => {
                return {
                  id: response.id,
                  colour: response.colour,
                  name: response.name,
                  price: response.price,
                  imgURL: response.imgURL,
                  thumb: response.thumb,
                  // sale: response.sale,
                  onSale: response.onSale
                };
              });

              const $$$$white = $$$$.filter(item => {
                return item.colour === "White Wine";
              }).map(response => {
                return {
                  id: response.id,
                  colour: response.colour,
                  name: response.name,
                  price: response.price,
                  imgURL: response.imgURL,
                  thumb: response.thumb,
                  // sale: response.sale,
                  onSale: response.onSale
                };
              });

              const $$$$red = $$$$.filter(item => {
                return item.colour === "Red Wine";
              }).map(response => {
                return {
                  id: response.id,
                  colour: response.colour,
                  name: response.name,
                  price: response.price,
                  imgURL: response.imgURL,
                  thumb: response.thumb,
                  // sale: response.sale,
                  onSale: response.onSale
                };
              });

              // const randomSample = _.sampleSize(this.state.wineArray, 6);

              this.setState({
                $white,
                $red,
                $$white,
                $$red,
                $$$white,
                $$$red,
                $$$$white,
                $$$$red,
                random: _.sampleSize($all, 6)
              });
              // console.log(this.state.random);
            }
          );
        }
      );
    });
  }

  render() {
    return (
      <Router basename='/project6'>
        <div className="App">

          <Route
            exact
            path="/"
            render={props => <Header {...props} appstate={this.appstate} />}
          />
          <section>
            <Route
              exact
              path="/"
              render={props => (
                <Form
                  {...props}
                  addToList={this.addToList}
                  handleChangeColour={this.handleChangeColour}
                  handleChangePrice={this.handleChangePrice}
                  displayWines={this.displayWines}
                />
              )}
            />
          </section>
          <section>
            <Route
              exact
              path="/"
              render={props => (
                <WineList
                  {...props}
                  random={this.state.random}
                  displayWines={this.displayWines}
                  userChoice={this.state.userChoice}
                />
              )}
            />
            <Route
              path="/products/:wine_id"
              render={props => (
                <Wineinfo
                  {...props}
                  user={this.state.user}
                  favourites={this.favourites}
                  appstate={this.appstate}
                />
              )}
            />
            {this.state.user ? (
              <Route
                path={`/user/${this.state.user.uid}`}
                render={props => (
                  <SavedList
                    {...props}
                    wineInfo={this.state.wineInfo}
                    deleteWine={this.deleteWine}
                    appstate={this.appstate}
                  />
                )}
              />
            ) : null}
          </section>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
