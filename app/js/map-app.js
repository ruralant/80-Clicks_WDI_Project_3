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
    GB: ["FRA", "BEL", "NLD", "ISL"],
    IE: ["GBR", "ISL"],
    FR: ["GBR"],
    BE: ["GBR"],
    ND: ["GBR"],
    IS: ["GBR","CAN", "NOR"],
    CA: ["ISL"],
    NO: ["ISL"],
    US: ["RUS", "JPN"],
    RU: ["JPN", "USA"], 
    JP: ["USA", "RUS", "PRK", "KOR"],
    KP: ["JPN"],
    KR: ["JPN"],
    CY: ["LI", "TUR", "LBN"],
    IL: ["CYP"],
    TR: ["CYP"],
    LB: ["CYP"],
    AO: ["BRA"],
    BR: ["AGO"],
    CL: ["NZL"],
    NZ: ["CHL", "AUS"],
    AU: ["NZL", "PNG", "IDN"],
    PG: ["AUS"],
    ID: ["PNG", "AUS", "PHL", "MYS", "SXM"],
    SX: ["IDN"],
    PH: ["IDN", "MYS", "VNM"],
    MY: ["PHL"],
    VN: ["PHL"],
    DK: ["NOR","SWE"],
    RU: ["NOR","UKR"],
    FR: ["GBR"],
    NL: ["GBR"],


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

gMaps.geocoder = new google.maps.Geocoder();

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

gMaps.getAlpha2Code = function(latLng, callback) {
  gMaps.geocoder.geocode({ location: latLng }, function(results, status) {
    if(status === "OK") {
      callback(results[results.length-1].address_components[0].short_name.toLowerCase());
    } else {
      callback(false);
    }
  });
}
  
var flagCounter= 0

gMaps.createFlag = function(questionCountry) {
  var flagContainer = document.getElementById('card-deck');
  var questionBox = document.createElement('DIV');
  var newCountry;
  questionBox.id = questionCountry.alpha2Code.toLowerCase();
  questionBox.classList.add("question-box");
  questionBox.classList.add("card");
  // questionBox.classList.add("col-md-6");

  questionBox.onclick = function() {
    console.log(questionCountry);
    console.log(neighbourMarkers);

   
     neighbourMarkers.forEach  (function(marker){
      console.log(neighbourMarkers);
      console.log(marker.id,questionCountry.alpha2Code);
       if (marker.id === questionCountry.alpha2Code){
         marker.setIcon(gMaps.getPinImage('D47E1A'));
         player.countryMarkers.push(marker.id);
        newCountry = marker
       }
         else if (marker.id != questionCountry.alpha2Code)  {
           marker.setMap(null);
         }     
        });
        if (player.continent.indexOf(questionCountry.region,0)===-1){
          player.continent.push(questionCountry.region);
          console.log(player.continent)
        }

        flagContainer.innerHTML = "";
        player.score +=1;
        console.log("neighbours", neighbourMarkers.length);
        
        
        console.log(player.score);
        neighbourMarkers = [];
        console.log("newCountry",newCountry) ;
        console.log("player array",player.countryMarkers);
        gMaps.createNeighbourMarkers(newCountry);
      
  
      }; 
      // google.maps.event.clearListeners(this, 'click');   
    
  

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
  console.log("availableNeighbours",availableNeighbours)

  currentNeighbours=[];

  if (player.score >80 ){
    alert("More Than 80 Clicks You Loose");
  }
  else if (availableNeighbours.length===0){
    alert("You are land locked you loose");
  }
 
}

gMaps.createNeighbourMarkers = function(marker) {
  
  var country = _.findWhere(this.cache, { alpha2Code: marker.id });
  console.log(country);
  var neighbours = country.borders.filter(function(country) {
    return player.countryMarkers.indexOf(country.alpha2Code) === -1
  });


  

  neighbours.forEach(function(data) {
    console.log("neighbourName",data.name);
    gMaps.geocoder.geocode({ address: data.name, componentRestrictions: { country: data.name } }, function(results, status) {
      var location = results[0].geometry.location;

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

      if  (player.countryMarkers.indexOf(data.alpha2Code,0)=== -1){
      var marker = new google.maps.Marker({
        position: location,
        map: gMaps.map,
        id: data.alpha2Code,
        icon: gMaps.getPinImage('000000')

      });}

      neighbourMarkers.push(marker);
      console.log(data.alpha2Code);
      currentNeighbours.push(data.alpha2Code);

      marker.addListener('mouseover', function() {
        infowindow.open(map, marker);
      });
        
          
      marker.addListener('mouseout', function() {
        infowindow.close();
      });

     
    });
  }); 
  
 gMaps.checkForLoose(currentNeighbours);
 
}

// questionNeighbour.capital

gMaps.setupStartingCountry = function() {

  var data = _.findWhere(gMaps.cache, { alpha2Code: 'RU' });

  console.log(data);
  var pinImage = gMaps.getPinImage('D47E1A');

  gMaps.geocoder.geocode({ address: data.name, componentRestrictions: { country: data.name } }, function(results, status) {
    var marker = new google.maps.Marker({
      position: results[0].geometry.location,
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
