var gMaps = gMaps || {};

gMaps.cache = {};

gMaps.call="1";

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
  color: '#fff000',
  countries: []
},{
  color: '#00ff00',
  countries: []
}];

//gMap initial setup (central point, initial zoom level)
gMaps.initialCenterPoint = { lat: 51.5080072, lng: -0.1019284 };

gMaps.geocoder = new google.maps.Geocoder();

gMaps.map = new google.maps.Map(document.getElementById('map'), {
  center: gMaps.initialCenterPoint,
  zoom: 3
});

gMaps.getTablesLayer = function(countryCodes, color) {
  console.log("layer update called" + gMaps.call);
  return new google.maps.FusionTablesLayer({
    query: {
      select: 'geometry',
      from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk',
      where: "ISO_2DIGIT IN ('" + countryCodes.join("','") + "')"
    },
    styles: [{
      polygonOptions: {
        fillColor: color,
        fillOpacity: 0.2
      }
    }],
    map: gMaps.map,
    suppressInfoWindows: true
  });
};

// funsion table layer for creating colored layers on the map
gMaps.startingCountriesLayer = gMaps.getTablesLayer(gMaps.startingCountries, '#00ffff');

// layers customisations
gMaps.highlightNeighbours = function(neighbours) {

  if(this.tablesLayer){
    this.tablesLayer.setMap(null);
  }

  this.tablesLayer = this.getTablesLayer(neighbours, '#0000ff');

  this.tablesLayer.addListener('click', function(e) {
    gMaps.getCountryData(e.latLng, gMaps.getNeighbours);
  });
}

// get the neighbours country
gMaps.getNeighbours = function(data) {
  gMaps.highlightNeighbours(data.borders);
}

// get the neighbours country inforations (short_name at the moment)
gMaps.getCountryData = function(latLng, callback) {
  gMaps.geocoder.geocode({ location: latLng }, function(results, status) {
    if(status === "OK") {
      var countryCode = results[results.length-1].address_components[0].short_name.toLowerCase();
      if(gMaps.cache[countryCode]) {
        callback(gMaps.cache[countryCode]);
      }
      else {
        $.get("https://restcountries.eu/rest/v1/alpha/" + countryCode)
          .done(function(data) {

            data.borders = data.borders.map(function(alpha3Code) {
              return gMaps.alpha3CodeConverter(alpha3Code);
            });
            gMaps.cache[countryCode] = data;
            callback(data);
          });
      }
    }
  });
}

gMaps.updatePlayer = function(alpha2Code){
  gMaps.players[gMaps.playerIndex].countries.push(alpha2Code);
  console.log("player " + gMaps.playerIndex+ " countries "  + gMaps.players[gMaps.playerIndex].countries);
  console.log("starting country list" + gMaps.startingCountries);
  gMaps.call = "2";
  gMaps.highlightPlayerLayer(gMaps.players[gMaps.playerIndex].countries, gMaps.players[gMaps.playerIndex].color);
}

gMaps.highlightPlayerLayer = function (countries, color){
  this.tablesLayer = this.getTablesLayer(countries, color);
}


gMaps.updateStartingCountriesLayer = function(e) {
  gMaps.getCountryData(e.latLng, function(data) {
    // gMaps.players[gMaps.playerIndex].countries.push(data.alpha2Code);


    gMaps.startingCountries = gMaps.startingCountries.filter(function(countryCode) {
      return countryCode !== data.alpha2Code
    });

   gMaps.updatePlayer(data.alpha2Code);

    gMaps.startingCountriesLayer.setMap(null);
    gMaps.startingCountriesLayer = gMaps.getTablesLayer(gMaps.startingCountries, '#0000ff');
    gMaps.startingCountriesLayer.addListener('click', gMaps.updateStartingCountriesLayer);
    // update player index
    // remove alpha2Code from starting Countries array (indexOf + splice/slice)
    // create a tablesLayer for player 1, with color (red/blue)
    // recreate tablesLayer for starting countries
  });
}

gMaps.startingCountriesLayer.addListener('click', gMaps.updateStartingCountriesLayer);

// gMaps.map.addListener('click', function(e) {
//   gMaps.getCountryData(e.latLng, gMaps.getNeighbours);
// });