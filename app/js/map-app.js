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

gMaps.checkBorders = function(country) {
  exceptions = {
    GB: ["FRA", "ISL"],
    IE: ["GBR", "ISL"],
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
  color: "D43D1A",
  countryMarkers: [],
  continent:[],
  score:0
},{
  color: "1E41A6",
  countryMarkers: [],
  continent:[],
  score:0
}];

var player = gMaps.players[gMaps.playerIndex];

//gMap initial setup (central point, initial zoom level)
gMaps.initialCenterPoint = { lat: 51.478972,  lng: -0.122068  };

// gMaps.geocoder = new google.maps.Geocoder();

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


var neighbourMarkers = [];
var currentNeighbours =[];


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
  var newCountry;
  questionBox.id = questionCountry.alpha2Code.toLowerCase();
  questionBox.classList.add("question-box");
  questionBox.classList.add("card");
  // questionBox.classList.add("col-md-6");

  questionBox.onclick = function() {

    neighbourMarkers.forEach(function(marker){

      if (marker.id === questionCountry.alpha2Code){
        marker.setIcon(gMaps.getPinImage('D47E1A'));
        player.countryMarkers.push(marker.id);
        newCountry = marker

        gMaps.map.panTo(marker.getPosition());
      }
      else if (marker.id != questionCountry.alpha2Code)  {
        marker.setMap(null);
      }     
    });

    if (player.continent.indexOf(questionCountry.region,0)===-1){
      player.continent.push(questionCountry.region);
    }

    flagContainer.innerHTML = "";
    player.score +=1;
    
    neighbourMarkers = [];
    gMaps.createNeighbourMarkers(newCountry);
   
  };      

  questionBox.innerHTML = "<img class='card-img-top' src='"+"/images/svg/" + questionCountry.alpha2Code.toLowerCase() + ".svg' alt='Card image cap'>\
        <div class='card-block'>\
          <h4 class='capital'>" + questionCountry.capital + "</h4>\
        </div>";


  flagContainer.appendChild(questionBox);

}


gMaps.checkForLoose = function(){

  console.log("currentNeighbours",currentNeighbours)
  availableNeighbours= currentNeighbours.filter(function(el){
    return !player.countryMarkers.includes(el);
  });

  currentNeighbours = [];

  if (player.score >80 ){
    alert("More Than 80 Clicks You Loose");
  }
  else if (availableNeighbours.length===0){
    alert("You are land locked you loose");
  }
 
}


gMaps.createNeighbourMarkers = function(marker) {
  
  var country = _.findWhere(this.cache, { alpha2Code: marker.id });
  var neighbours = country.borders.filter(function(country) {
    return player.countryMarkers.indexOf(country.alpha2Code) === -1
  });

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

    if(player.countryMarkers.indexOf(data.alpha2Code,0)=== -1){
      var marker = new google.maps.Marker({
        position: location,
        map: gMaps.map,
        id: data.alpha2Code,
        icon: gMaps.getPinImage('000000')
      });
    }

    neighbourMarkers.push(marker);
    currentNeighbours.push(data.alpha2Code);

    marker.addListener('mouseover', function() {
      infowindow.open(map, marker);
    });
      
        
    marker.addListener('mouseout', function() {
      infowindow.close();
    });
  
  });
  
 gMaps.checkForLoose(currentNeighbours);
 
}

// questionNeighbour.capital

gMaps.setupStartingCountry = function() {

  var data = _.findWhere(gMaps.cache, { alpha2Code: 'RU' });

  console.log(data);
  var pinImage = gMaps.getPinImage('D47E1A');

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(data.latlng[0], data.latlng[1]),
    map: gMaps.map,
    id: data.alpha2Code,
    icon: pinImage,
    return: data.region
  });

  marker.addListener('click', function() {
    var player = gMaps.players[gMaps.playerIndex];
    player.countryMarkers.push(data.alpha2Code);
    console.log("Player country array", player.countryMarkers);
    this.setIcon(pinImage);
    google.maps.event.clearListeners(this, 'click');

    gMaps.createNeighbourMarkers(this);
  });
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
