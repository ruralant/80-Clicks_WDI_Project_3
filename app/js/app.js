console.log("JS linked!")

var EmpireApp = EmpireApp || {};

EmpireApp.API_URL = "http://localhost:3000/api";

EmpireApp.setRequestHeader = function(jqXHR) {
  var token = window.localStorage.getItem("token");
  if(!!token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
}

EmpireApp.getTemplate = function(template, data) {
  return $.get('/templates/' + template + '.html').done(function(templateHtml) {
    var html = _.template(templateHtml)(data);
    EmpireApp.$main.html(html);
    EmpireApp.updateUI();
  });
}

EmpireApp.updateUI = function() {
  var loggedIn = !!window.localStorage.getItem("token");

  if(loggedIn) {
    $('.logged-in').removeClass("hidden");
    $('.logged-out').addClass("hidden");
  } else {
   $('.logged-in').addClass("hidden");
   $('.logged-out').removeClass("hidden"); 
  }
}