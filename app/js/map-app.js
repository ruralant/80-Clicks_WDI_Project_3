var gMaps = gMaps || {};

gMaps.cache = {};

// convert the alpha3 codes in alpha2 codes slicing the last letter apart for the following exceptions. 
gMaps.alpha3CodeConverter = function(alpha3Code) {
  var execptions = {
    ALA: "AX",
    AND: "AD",
    AGO: "AO",
    ATG: "AG",
    ARM: "AM",
    ABW: "AW",
    ARE: "AE",
    ATF: "TF",
    AUT: "AT",
    BHS: "BS",
    BGD: "BD",
    BRB: "BB",
    BLR: "BY",
    BLZ: "BZ",
    BEN: "BJ",
    BES: "BQ",
    BIH: "BA",
    BRN: "BN",
    BDI: "BI",
    CPV: "CV",
    CYM: "KY",
    CAF: "CF",
    CHL: "CL",
    CHN: "CN",
    COM: "KM",
    COG: "CG",
    COD: "CD",
    COK: "CK",
    CUW: "CW",
    DNK: "DK",
    EST: "EE",
    ESH: "EH",
    FLK: "FK",
    FRO: "FO",
    FSM: "FM",
    GNQ: "GQ",
    GUF: "GF",
    GRL: "GL",
    GRD: "GD",
    GLP: "GP",
    GIN: "GN",
    GNB: "GW",
    GUY: "GY",
    IRQ: "IQ",
    IRL: "IE",
    ISR: "IL",
    JAM: "JM",
    KAZ: "KZ",
    KOS: "XK",
    KOR: "KR",
    LBR: "LR",
    LBY: "LY",
    MAC: "MO",
    MAF: "MF",
    MDG: "MG",
    MDV: "MV",
    MLT: "MT",
    MTQ: "MQ",
    MOZ: "MZ",
    MYT: "YT",
    MEX: "MX",
    MNE: "ME",
    MOZ: "MZ",
    MNP: "MP",
    NIU: "NU",
    PAK: "PK",
    PLW: "PW",
    PNG: "PG",
    PCN: "PN",
    POL: "PL",
    PRY: "PY",
    PRK: "KP",
    PRT: "PT",
    PAK: "PK",
    PYF: "PF",
    SYC: "SC",
    SEN: "SN",
    SLV: "SV",
    SVK: "SK",
    SVN: "SI",
    SLB: "SB",
    SGS: "GS",
    SUR: "SR",
    SWZ: "SZ",
    SWE: "SE",    
    SPM: "PM",
    SRB: "RS",
    SWZ: "SZ",
    TCD: "TD",
    TKM: "TM",
    TUN: "TN",
    TON: "TO",
    TUR: "TR",
    TUV: "TV",
    UKR: "UA",
    URY: "UY",
    VGB: "VG",
    WLF: "WF",
  }

  if(alpha3Code in execptions) {
    return execptions[alpha3Code];
  }
  else {
    return alpha3Code.slice(0, -1);
  }
}

gMaps.startingCountries = [
  "RU",
  "US",
  "IN",
  "CN",
  "FR",
  "DE",
  "BR",
  "KP",
  "AO",
  "AU"
];

gMaps.playerIndex = 0;

gMaps.players = [{
  color: "red",
  countryMarkers: []
},{
  color: "blue",
  countryMarkers: []
}];

//gMap initial setup (central point, initial zoom level)
gMaps.initialCenterPoint = { lat: 51.5080072, lng: -0.1019284 };

gMaps.geocoder = new google.maps.Geocoder();

gMaps.map = new google.maps.Map(document.getElementById('map'), {
  center: gMaps.initialCenterPoint,
  zoom: 3
});

// gMaps.getTablesLayer = function() {
//   return new google.maps.FusionTablesLayer({
//     query: {
//       select: 'geometry',
//       from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk',
//       query: "ISO_2DIGIT IN ('" + gMaps.startingCountries.join(',') + "')"
//     },
//     styles: [{
//       polygonOptions: {
//         fillColor: "#000000",
//         fillOpacity: 1
//       }
//     }],
//     map: gMaps.map,
//     suppressInfoWindows: true
//   });
// };

// funsion table layer for creating colored layers on the map
// gMaps.tablesLayer = gMaps.getTablesLayer();

// layers customisations
// gMaps.highlightNeighbours = function(neighbours) {

//   if(this.tablesLayer){
//     this.tablesLayer.setMap(null);
//   }

//   this.tablesLayer = this.getTablesLayer(neighbours, '#0000ff');

//   this.tablesLayer.addListener('click', function(e) {
//     gMaps.getCountryData(e.latLng, gMaps.getNeighbours);
//   });
// }

// get the neighbours country
// gMaps.getNeighbours = function(data) {
//   gMaps.highlightNeighbours(data.borders);
// }

// get the neighbours country inforations (short_name at the moment)
gMaps.getCountryData = function(countryCode, callback) {
  if(gMaps.cache[countryCode]) {
    callback(gMaps.cache[countryCode]);
  }
  else {
    $.get("https://restcountries.eu/rest/v1/alpha/" + countryCode)
      .done(function(data) {

        var country = {
          borders: data.borders.map(function(alpha3Code) {
            return gMaps.alpha3CodeConverter(alpha3Code);
          }),
          tanks: Math.ceil(data.population * 0.001),
          name: data.name
        };

        gMaps.cache[countryCode] = country;
        callback(country);
      });
  }
}

gMaps.getCountryCode = function(latLng, callback) {
  gMaps.geocoder.geocode({ location: latLng }, function(results, status) {
    if(status === "OK") {
      callback(results[results.length-1].address_components[0].short_name.toLowerCase());
    } else {
      callback(false);
    }
  });
}

gMaps.setupStartingCountries = function() {
  this.startingCountries.forEach(function(countryCode) {
    gMaps.getCountryData(countryCode, function(data) {
      gMaps.geocoder.geocode({ address: data.name }, function(results, status) {
        var location = results[0].geometry.location;

        var marker = new google.maps.Marker({
          position: location,
          map: gMaps.map,
          id: countryCode,
          icon: "/images/tankMarker-yellow-" + data.tanks + ".png"
        });

        marker.addListener('click', function() {
          var player = gMaps.players[gMaps.playerIndex];
          player.countryMarkers.push(this);
          this.setIcon("/images/tankMarker-" + player.color + "-" + data.tanks + ".png");
          google.maps.event.clearListeners(this, 'click');

          gMaps.playerIndex += 1;
          if(gMaps.playerIndex >= gMaps.players.length) {
            gMaps.playerIndex = 0;
          }
        });

      });
    });
  });
}

gMaps.init = function() {
  this.setupStartingCountries();
}

gMaps.init();


// gMaps.updatePlayer = function(alpha2Code){
//   var player = gMaps.players[gMaps.playerIndex];
//   player.countries.push(alpha2Code);
//   if(player.countriesLayer){
//     player.countriesLayer.setMap(null);
//   }
//   player.countriesLayer = gMaps.getTablesLayer(player.countries, player.color);
// }


// gMaps.updateTablesLayer = function(e) {
//   gMaps.getCountryData(e.latLng, function(data) {
//     // gMaps.players[gMaps.playerIndex].countries.push(data.alpha2Code);


//     gMaps.startingCountries = gMaps.startingCountries.filter(function(countryCode) {
//       return countryCode !== data.alpha2Code
//     });

//     gMaps.updatePlayer(data.alpha2Code);

//     gMaps.tablesLayer.setMap(null);
//     gMaps.tablesLayer = gMaps.getTablesLayer();
//     gMaps.tablesLayer.addListener('click', gMaps.updateTablesLayer);
//     // update player index
//     // remove alpha2Code from starting Countries array (indexOf + splice/slice)
//     // create a tablesLayer for player 1, with color (red/blue)
//     // recreate tablesLayer for starting countries
//   });
// }

// gMaps.startingCountriesLayer.addListener('click', gMaps.updateStartingCountriesLayer);

// gMaps.map.addListener('click', function(e) {
//   gMaps.getCountryData(e.latLng, gMaps.getNeighbours);
// });