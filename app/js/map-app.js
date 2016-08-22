var gMaps = gMaps || {};

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

//gMap initial setup (central point, initial zoom level)
gMaps.initialCenterPoint = { lat: 51.5080072, lng: -0.1019284 };

gMaps.geocoder = new google.maps.Geocoder();

gMaps.map = new google.maps.Map(document.getElementById('map'), {
  center: gMaps.initialCenterPoint,
  zoom: 2
});

// funsion table layer for creating colored layers on the map
gMaps.tablesLayer = new google.maps.FusionTablesLayer({
  map: gMaps.map,
});

// layers customisations
gMaps.highlightNeighbours = function(neighbours) {

  if(this.tablesLayer){
    this.tablesLayer.setMap(null);
  }

  this.tablesLayer = new google.maps.FusionTablesLayer({
    query: {
      select: 'geometry',
      from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk',
      where: "ISO_2DIGIT IN ('" + neighbours.join("','") + "')"
    },
    styles: [{
      polygonOptions: {
        fillColor: "#000",
        fillOpacity: 0.2
      }
    }],
    map: gMaps.map,
    suppressInfoWindows: true
  });

  this.tablesLayer.addListener('click', function(e) {
    gMaps.getCountryData(e.latLng, gMaps.getNeighbours);
  });
}

// get the neighbours country
gMaps.getNeighbours = function(data) {
  var neighbours = data.borders.map(function(alpha3Code) {
    return gMaps.alpha3CodeConverter(alpha3Code);
  });
  gMaps.highlightNeighbours(neighbours);
}

// get the neighbours country inforations (short_name at the moment)
gMaps.getCountryData = function(latLng, callback) {
  gMaps.geocoder.geocode({ location: latLng }, function(results, status) {
    if(status === "OK") {
      var country = results[results.length-1].address_components[0];
      $.get("https://restcountries.eu/rest/v1/alpha/" + country.short_name.toLowerCase())
        .done(function(data) {
          callback(data);
        });
    }
  });
}

gMaps.map.addListener('click', function(e) {
  gMaps.getCountryData(e.latLng, gMaps.getNeighbours);
});