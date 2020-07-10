jQuery(document).ready(function ($) {
  // TODO: Check to see last time we queried for this item
  var start = performance.now();
  var op = 'check';
  var page = document.location.pathname.split("/").join("_");
  var param = processParams();
  var cookie = processCookies();
  var taxonomy = processTaxonomy();
  var dataset = new Array(page, param, cookie, taxonomy);
  var final = encodeURIComponent(dataset.join("----"));
  getDisplay(op, final);
  var end = performance.now();
});


// Send data to controller and retrieve results
function getDisplay(op, id) {
  var request = new XMLHttpRequest();
  var endpoint = '/wordstream_display/' + op + '/' + id;

  request.open('GET', endpoint, true);
  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      var data = JSON.parse(this.response);
      displayItems(data);
    } else {
      // We reached our target server, but it returned an error
    }
  };
  request.onerror = function () {
    // There was a connection error of some sort
  };

  request.send();

}

// Execute our instructions to page
function displayItems(data) {
  // Iterate through items to get instructions
  for (var key in data) {
    var value = data[key];
    var region = value['region'];
    var placement = value['placement'];
    var result = value['result'];
    var events = value['events'];
    if (result == 1) {
      var html = value['html'];
      var location = document.getElementById(region);
      if (location === null) {
        var location = document.getElementsByClassName(region);
        var i;
        for (i = 0; i < location.length; i++) {
          location[i].insertAdjacentHTML(placement, html);
        }
      }
      else {
        location.insertAdjacentHTML(placement, html);
      }
      location = undefined;

      // events-related
      if (events !== null) {
        var e;
        for (e = 0; e < events.length; e++) {
          //console.log(events[e]);
          var action = events[e]['action'];
          var category = events[e]['category'];
          var label = events[e]['label'];
          //console.log('action = ' + action);
          dataLayer.push({'event': 'wsdDisplayItem', 'category': category, 'action': action, 'label': label});
        }
      }
    }
  }
}


function processCookies() {
  var string = 'wsd_';
  var output = '';
  var cookies = jayway_searchCookie(string);
  if (cookies !== 0) {
    var process = [];
    for (var key in cookies) {
      process.push(key + '=' + cookies[key]);
    }
    var output = encodeURIComponent(process.join("&"));
  }
  return(output);
}


function processTaxonomy() {
  var data = window.wsdDataLayer;
  var output = '';
  if (data !== undefined) {
    var process = [];
    for (let key in data[0]) {
      process.push(key + '=' + data[0][key]);
    }
    var output = process.join("&");
  }
  return(output);
}

function processParams() {
  var data = document.location.search.replace('?', '');
  var output = '';
  if (data !== "") {
    output = data;
  }
  return(output);
}


/* Simple element toggle function which sets cookie to remember the visitor's choice */
function wsd_ToggleItem(id) {
  document.getElementById(id).style.display = "none";
  jayway_setCookie(id, 'kill', expire = 365);
}
