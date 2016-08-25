var gMaps = gMaps || {};

gMaps.cache = [];

var currentRound = 0;
var occupiedCountries=[];
var startLatLng;
var endLatLng;

gMaps.checkBorders = function(country) {
  exceptions = {
    GB: ["FRA", "ISL"],
    IE: ["ISL"],
    FR: ["GBR"],
    BE: ["GBR"],
    ND: ["GBR"],
    IS: ["GBR", "CAN"],
    CA: ["ISL"],
    NO: ["ISL"],
    US: ["RUS", "JPN"],
    RU: ["JPN", "USA"], 
    JP: ["USA", "RUS"],
    KP: ["JPN"],
    KR: ["JPN"],
    CY: ["LI", "TUR"],
    IL: ["CYP"],
    TR: ["CYP"],
    LB: ["CYP"],
    AO: ["BRA"],
    BR: ["AGO"],
    CL: ["NZL"],
    NZ: ["CHL", "AUS"],
    AU: ["NZL", "PNG"],
    PG: ["AUS"],
    ID: ["PNG", "AUS"],
    SX: ["IDN"],
    PH: ["IDN", "MYS"],
    MY: ["PHL"],
    VN: ["PHL"],
    DK: ["NOR", "SWE"],
    RU: ["NOR", "UKR"],
    FR: ["GBR"],
    NL: ["GBR"],
    AX: ["SWE", "FIN"],
    AS: ["AUT", "NIC"],
    AI: ["BRA", "VEN"],
    CA: ["GRL"],
    BS: ["USA", "CUB"],
    BH: ["QAT", "KWT"],
    VG: ["PRI", "VEN"],
    BN: ["IDN"],
    CV: ["USA", "MRT"],
    CX: ["AUT", "IDN"],
    CY: ["TUR", "SYR"],
    FK: ["ARG", "URY"],
    FJ: ["AUS", "USA"],
    GI: ["ESP", "MAR"],
    GL: ["ISL", "CAN"],
    HT: ["CUB"],
    HK: ["PHL"],
    IS: ["GRL", "NOR"],
    IM: ["IRL"],
    JM: ["CUB", "VEN"],
    JP: ["KOR", "USA"],
    MO: ["HKG"],
    PH: ["HKG", "MYS"],
    MV: ["IND", "KEN"],
    MU: ["MDG", "IND"],
    MC: ["ITA", "TUN"],
    PT: ["BRA"],
    PR: ["DOM", "VEN"],
    QA: ["IRN"],
    KN: ["VEN", "DOM"],
    WS: ["AUS", "MEX"],
    KR: ["JPN", "AUS"],
    LK: ["AUS"],
    TW: ["PHL", "JPN"],
    TT: ["BRA", "PRI"],
  }

  if(country.alpha2Code in exceptions) {
    country.borders = country.borders.concat(exceptions[country.alpha2Code]);
  }

  return country;
}

gMaps.playerIndex = 0;

gMaps.players = [{
  name:"One",
  color: "FF0000",
  neighbourColor: "AA0000",
  countryMarkers: [],
  continent:[],
  score:0,
  lastCountryPlayed:"",
  lastLatLng:[]
},{
  name:"Two",
  color: "0000FF",
  neighbourColor: '0000AA',
  countryMarkers: [],
  continent:[],
  score:0,
  lastCountryPlayed:"",
  lastLatLng:[]
}];

gMaps.player = gMaps.players[gMaps.playerIndex];

//gMap initial setup (central point, initial zoom level)
gMaps.initialCenterPoint = { lat: 51.478972,  lng: -0.122068  };

gMaps.neighbourMarkers = [];
gMaps.currentNeighbours = [];

gMaps.map = new google.maps.Map(document.getElementById('map'), {
  center: gMaps.initialCenterPoint,
  zoom: 3,
  maxZoom: 5,
  minZoom: 2,
  disableDefaultUI: true,
  styles: [{
      "elementType": "labels",
      "stylers": [{ "visibility": "off" }]
    }],
});

gMaps.getPinImage = function(color){
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34)
  );
  return pinImage;
};

// gMaps.getAlpha2Code = function(latLng, callback) {
//   gMaps.geocoder.geocode({ location: latLng }, function(results, status) {
//     if(status === "OK") {
//       callback(results[results.length-1].address_components[0].short_name.toLowerCase());
//     } else {
//       callback(false);
//     }
//   });
// }
 

// var flagCounter= 0

gMaps.createFlag = function(questionCountry) {
  var flagContainer = document.getElementById('card-deck');
  var questionBox = document.createElement('DIV');
  
  questionBox.id = questionCountry.alpha2Code.toLowerCase();
  questionBox.classList.add("question-box");
  questionBox.classList.add("card");

  questionBox.onclick = function() {

    if(currentRound > 1) {
      startLatLng = gMaps.player.lastLatLng
    }

    gMaps.player.lastLatLng = questionCountry.latlng

    var line = new google.maps.Polyline({
      path: [
        new google.maps.LatLng(startLatLng[0], startLatLng[1]), 
        new google.maps.LatLng(gMaps.player.lastLatLng[0], gMaps.player.lastLatLng[1])
      ],

      strokeColor: "#"+gMaps.player.color,
      strokeOpacity: 1.0,
      strokeWeight: 5,
      map: gMaps.map
    });

    if(gMaps.neighbourMarkers.length === 0){
      alert("end of game");
    }

    gMaps.neighbourMarkers.forEach(function(marker, idx){
      if (marker.id === questionCountry.alpha2Code){
        
        var colorCode = gMaps.playerIndex===0 ? 'D43D1A' : '1E416A';

        marker.setIcon(gMaps.getPinImage(colorCode));
        gMaps.player.countryMarkers.push(marker.id);
        
        occupiedCountries.push(marker.id);
        gMaps.player.lastCountryPlayed = gMaps.neighbourMarkers.splice(idx,1)[0];

        console.log("mikeys magic",gMaps.neighbourMarkers.splice(idx,1)[0]);
        console.log("lastcountry played after mike magic",gMaps.player.lastCountryPlayed);

        gMaps.player.lastCountryPlayed.setMap(gMaps.map);
      }
      else if (marker.id != questionCountry.alpha2Code)  {
        marker.setMap(null);
      }     
    });
        
    if (gMaps.player.continent.indexOf(questionCountry.region,0)===-1){
      gMaps.player.continent.push(questionCountry.region);
    }

    flagContainer.innerHTML = "";
    gMaps.player.score +=1;

    currentRound+=1;

    gMaps.playerIndex+=1;
    if(gMaps.playerIndex > gMaps.players.length-1) gMaps.playerIndex = 0;
    gMaps.player = gMaps.players[gMaps.playerIndex];

    if(currentRound===1){
      gMaps.setupStartingCountry();
    }
    else {
      gMaps.createNeighbourMarkers(gMaps.player.lastCountryPlayed);
    }
   
  }      

  questionBox.innerHTML = "<img class='card-img-top' src='"+"/images/svg/" + questionCountry.alpha2Code.toLowerCase() + ".svg' alt='Card image cap'>\
        <div class='card-block'>\
          <h4 class='capital'>" + questionCountry.capital + "</h4>\
        </div>";

  flagContainer.appendChild(questionBox);
}

gMaps.checkForLose = function(){

  availableNeighbours = gMaps.currentNeighbours.filter(function(el){
    return !gMaps.player.countryMarkers.includes(el);
  });

  gMaps.currentNeighbours = [];

  if (gMaps.player.score > 80 ){
    alert("More Than 80 Clicks You Lose");
  }
  else if (availableNeighbours.length===0){
    alert("You are land locked you loose");
  }
 
}


gMaps.createNeighbourMarkers = function(marker) {

  gMaps.neighbourMarkers.forEach(function(marker) {
    marker.setMap(null);
  });

  gMaps.neighbourMarkers = [];

  var neighbours = [];
  var country = _.findWhere(this.cache, { alpha2Code: marker.id });
  var possibleNeighbours = country.borders.filter(function(country) {
    return gMaps.player.countryMarkers.indexOf(country.alpha2Code) === -1
  });

  possibleNeighbours.forEach(function(data){
    if (occupiedCountries.indexOf(data.alpha2Code,0)===-1){
      neighbours.push(data);
    }
  });
  
  if (neighbours.length === 0 ){
    alert("Player "+gMaps.player.name+" you loose");
  }

  neighbours.forEach(function(data) {
    var location = new google.maps.LatLng(data.latlng[0], data.latlng[1]);
    var contentString = '<div id="infoWinContent">\
          <h1 id="firstHeading" class="firstHeading">'+data.name+'</h1>\
          <div id="bodyContent" class="col-sm-4">\
            <p><b>Population</b>'+data.population+'</p>\
            <p><b>Area</b>'+data.area+'</p>\
          </div>\
        </div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      disableAutoPan: true
    });

    gMaps.createFlag(data);

    if(gMaps.player.countryMarkers.indexOf(data.alpha2Code,0) === -1){
      var marker = new google.maps.Marker({
        position: location,
        map: gMaps.map,
        id: data.alpha2Code,
        icon: gMaps.getPinImage(gMaps.player.neighbourColor)
      });

      marker.addListener('mouseover', function() {
        infowindow.open(map, marker);
      });
        
          
      marker.addListener('mouseout', function() {
        infowindow.close();
      });

      gMaps.neighbourMarkers.push(marker);
      gMaps.currentNeighbours.push(data.alpha2Code);
    }
  });

  if (currentRound >1){
  gMaps.map.panTo(gMaps.player.lastCountryPlayed.getPosition());
  };
 
}

// questionNeighbour.capital

gMaps.setupStartingCountry = function() {

  var data = _.findWhere(gMaps.cache, { alpha2Code: 'GB' });

  startLatLng = data.latlng;

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.latlng[0], data.latlng[1]),
    map: gMaps.map,
    id: data.alpha2Code,
    icon: gMaps.getPinImage('000000'),
    return: data.region
  });

  gMaps.createNeighbourMarkers(marker);

  // marker.addListener('click', function() {
  //   gMaps.player = gMaps.players[gMaps.playerIndex];
  //   gMaps.player.countryMarkers.push(data.alpha2Code);
  //   this.setIcon(gMaps.getPinImage('000000'));
  //   google.maps.event.clearListeners(this, 'click');

    
  // });
}


gMaps.init = function() {
  this.setupStartingCountry();
}


$.get("https://restcountries.eu/rest/v1/all").done(function(data) {

  gMaps.cache = data;

  gMaps.cache.map(function(country) {
    country = gMaps.checkBorders(country);
    country.borders = country.borders.map(function(alpha3Code) {
      return _.findWhere(gMaps.cache, { alpha3Code: alpha3Code });
    });
    return country;
  });

  gMaps.init();
});
