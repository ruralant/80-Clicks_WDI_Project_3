var gMaps = gMaps || {};

gMaps.cache = [];

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
  // "RU",
  // "US",
  // "IN",
  // "CN",
  // "FR",
  // "DE",
  // "BR",
  // "KP",
  // "AO",
  // "AU"
];

gMaps.playerIndex = 0;

gMaps.players = [{
  color: "D43D1A",
  countryMarkers: []
},{
  color: "1E41A6",
  countryMarkers: []
}];

//gMap initial setup (central point, initial zoom level)
gMaps.initialCenterPoint = { lat: 48.210534,  lng: 16.379365, };

gMaps.geocoder = new google.maps.Geocoder();

gMaps.map = new google.maps.Map(document.getElementById('map'), {
  center: gMaps.initialCenterPoint,
  zoom: 3
});

gMaps.getCountryCode = function(latLng, callback) {
  gMaps.geocoder.geocode({ location: latLng }, function(results, status) {
    if(status === "OK") {
      callback(results[results.length-1].address_components[0].short_name.toLowerCase());
    } else {
      callback(false);
    }
  });
}

gMaps.getNeighbours = function(data) {
  var neighbours = data.borders.map(function(alpha3Code) {
    return gMaps.alpha3CodeConverter(alpha3Code);
  });

}

gMaps.getCountryData = function(latLng, callback) {
  console.log("country click");
  gMaps.geocoder.geocode({ location: latLng }, function(results, status) {

    if(status === "OK") {
      var country = results[results.length-1].address_components[0];
      console.log(country);
      $.get("https://restcountries.eu/rest/v1/alpha/" + country.short_name.toLowerCase())

        .done(function(data) {
        
          // callback(data);
        });
    }
  });
}

var player = gMaps.players[gMaps.playerIndex];
var pinColor = player.color;
var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
  new google.maps.Size(21, 34),
  new google.maps.Point(0,0),
  new google.maps.Point(10, 34));



// gMaps.map.addListener('click', function(e) {
//   gMaps.getCountryData(e.latLng, gMaps.getNeighbours);
// });


gMaps.createNeighbourMarkers = function(marker) {

  var country = _.findWhere(this.cache, { countryCode: marker.id });
  var neighbours = country.borders.map(function(countryCode) {
    return _.findWhere(gMaps.cache, { countryCode: countryCode });
  });

  console.log(neighbours.length);

  neighbours.forEach(function(data) {
    gMaps.geocoder.geocode({ address: data.name }, function(results, status) {
      var location = results[0].geometry.location;

      var contentString = '<div id="infoWinContent">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+data.name+'</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Population</b>'+data.population+'</p>'+
            '<p><b>Area</b>'+data.area+'</p>'+
            '</div>'+
            '</div>';

      var infowindow = new google.maps.InfoWindow({
                content: contentString
              });

      var marker = new google.maps.Marker({
        position: location,
        map: gMaps.map,
        id: data.countryCode,
        icon: pinImage
      });



      marker.addListener('mouseover', function() {
                infowindow.open(map, marker);
              });
      marker.addListener('mouseout', function() {
          infowindow.close();
      });

      marker.addListener('click', function() {
        var player = gMaps.players[gMaps.playerIndex];
        player.countryMarkers.push(this);
        this.setIcon 
        google.maps.event.clearListeners(this, 'click');

     
      

      

    });
  })
} 

gMaps.addAttackEvents = function() {
  var player = gMaps.players[gMaps.playerIndex];

  player.countryMarkers.forEach(function(marker) {
    marker.addListener('click', function() {
      console.log("clicked");
      gMaps.createNeighbourMarkers(this);
    });
  });
}

gMaps.setupStartingCountry = function() {
  // this.startingCountries.forEach(function(countryCode) {

    var data = _.findWhere(gMaps.cache, { countryCode: 'AT'});
    
    gMaps.geocoder.geocode({ address: data.name }, function(results, status) {
      var location = gMaps.initialCenterPoint;

      
      var marker = new google.maps.Marker({
        position: location,
        map: gMaps.map,
        id: data.countryCode,
        icon: pinImage
      });

      marker.addListener('click', function() {
        var player = gMaps.players[gMaps.playerIndex];
        player.countryMarkers.push(this);
        this.setIcon(pinImage);
        google.maps.event.clearListeners(this, 'click');

        // gMaps.playerIndex += 1;
        // if(gMaps.playerIndex >= gMaps.players.length) {
        //   gMaps.playerIndex = 0;
        // }

        // gMaps.startingCountries = gMaps.startingCountries.filter(function(startingCountryCode) {
        //   return startingCountryCode !== countryCode 
        // });

        if(gMaps.startingCountries.length === 0) {
          gMaps.addAttackEvents();
        }
      });

    });
  // });
}

gMaps.init = function() {
  this.setupStartingCountry();
}

$.get("https://restcountries.eu/rest/v1/all")

.done(function(data) {
    console.log(data.length);
    data.forEach(function(countryData) {
      var country = {
        borders: countryData.borders.map(function(alpha3Code) {
          return gMaps.alpha3CodeConverter(alpha3Code);
        }),
        population: countryData.population,
        name: countryData.name,
        countryCode: countryData.alpha2Code,
        area: countryData.area,
        capital: countryData.capital
      };

      gMaps.cache.push(country);
     

    });

  gMaps.init();
});


