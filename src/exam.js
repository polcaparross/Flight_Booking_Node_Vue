
//== Backend =================================================================

// Airlines

const AirEuropa = {
  getFlights: function() {
    return new Promise(function(resolve, reject) {
      resolve([
        { from: 'Barcelona', to: 'Paris', price: 100 },
        { from: 'Berlin', to: 'Rome', price: 200 },
      ])
    });
  }
}

const Delta = {
  getFlights: function() {
    return new Promise(function(resolve, reject) {
      setTimeout(() =>
        resolve([
          { from: 'New York', to: 'Barcelona', price: 700 },
        ])
      , 30);
    });
  }
}

let ryanairWillTimeout = false;

const Ryanair = {       // this airline sometimes timeouts
  getFlights: function() {
    return new Promise(function(resolve, reject) {
      if (! ryanairWillTimeout) {
        resolve([
          { from: 'Budapest', to: 'Berlin', price: 55 },
        ])
      }
      ryanairWillTimeout = ! ryanairWillTimeout;
    });
  }
}

const Vueling = {
  getFlights: function() {
    return new Promise(function(resolve, reject) {
      resolve([
        { from: 'London', to: 'Luxemburg', price: 150 },
        { from: 'New York', to: 'Barcelona', price: 300 },
      ])
    });
  }
}

// TODO

// const flightsServer = ...


//== Web Server ==============================================================

import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


app.get('/flights/:min?/:max?', (req, res) => {
  if (typeof flightsServer != "undefined") {
    flightsServer.getFilteredFlights(req.params.min, req.params.max)
    .then(data => res.json(data))
    .catch(error => res.status(500).json({error}));
  } else {
    // hardcoded response for when flightsServer is not implemented
    res.json(
    [{"from":"Barcelona","to":"Paris","price":100},
    {"from":"Berlin","to":"Rome","price":200},
    {"from":"Budapest","to":"Berlin","price":55},
    {"from":"London","to":"Luxemburg","price":150},
    {"from":"New York","to":"Barcelona","price":300}]);
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))
