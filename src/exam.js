//== Backend =================================================================

// Airlines

const AirEuropa = {
  getFlights: function () {
    return new Promise(function (resolve, reject) {
      resolve([
        { from: "Barcelona", to: "Paris", price: 100 },
        { from: "Berlin", to: "Rome", price: 200 },
      ]);
    });
  },
};

const Delta = {
  getFlights: function () {
    return new Promise(function (resolve, reject) {
      setTimeout(
        () => resolve([{ from: "New York", to: "Barcelona", price: 700 }]),
        30
      );
    });
  },
};

let ryanairWillTimeout = false;

const Ryanair = {
  // this airline sometimes timeouts
  getFlights: function () {
    return new Promise(function (resolve, reject) {
      if (!ryanairWillTimeout) {
        resolve([{ from: "Budapest", to: "Berlin", price: 55 }]);
      }
      ryanairWillTimeout = !ryanairWillTimeout;
    });
  },
};

const Vueling = {
  getFlights: function () {
    return new Promise(function (resolve, reject) {
      resolve([
        { from: "London", to: "Luxemburg", price: 150 },
        { from: "New York", to: "Barcelona", price: 300 },
      ]);
    });
  },
};

// TODO
const flightsServer = {
  proveidors: [AirEuropa, Delta, Ryanair, Vueling],
  actualInterval: null,
  getFilteredFlights: function (min, max) {
    let allFlights = [];
    let finalFlights = [];
    return new Promise((resolve, reject) => {
      let promises = this.proveidors.map((el) => {
        return new Promise((resolve, reject) => {
          let timeout = setTimeout(() => {
            reject("timeout");
          }, 500);

          el.getFlights()
            .then((flights) => {
              clearTimeout(timeout);
              resolve(flights);
            })
            .catch(() => {
              clearTimeout(timeout);
              reject();
            });
        }) 
          .then((flights) => {
            allFlights = allFlights.concat(flights);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      Promise.all(promises).then(() => {
        allFlights.forEach((el) => {
          if (el.price >= min && el.price <= max) {
            finalFlights.push(el);
          }
        });

        resolve(finalFlights);
      });
    });
  },
};

//== Web Server ==============================================================

import express from "express";
import path from "path";
import cors from "cors";

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/flights/:min?/:max?", (req, res) => {
  //if (typeof flightsServer != "undefined") {
  flightsServer
    .getFilteredFlights(req.params.min, req.params.max)
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ error }));
  /* } else {
    // hardcoded response for when flightsServer is not implemented
    res.json([
      { from: "Barcelona", to: "Paris", price: 100 },
      { from: "Berlin", to: "Rome", price: 200 },
      { from: "Budapest", to: "Berlin", price: 55 },
      { from: "London", to: "Luxemburg", price: 150 },
      { from: "New York", to: "Barcelona", price: 300 },
    ]);
  } */
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));