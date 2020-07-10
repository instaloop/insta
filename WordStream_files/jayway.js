/* Set one particular cookie */
function jayway_setCookie(cname, cvalue, expire = 365) {
  var current = Date.now() / 1000 | 0;
  var expire_epoch = current + (expire*86400);
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(expire_epoch);
  var expires = "expires="+ d;
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


/* Get all cookies in an array */
function jayway_getCookies() {
  var cookies = { };
  if (document.cookie && document.cookie != '') {
    var split = document.cookie.split(';');
    for (var i = 0; i < split.length; i++) {
      var name_value = split[i].split("=");
      name_value[0] = name_value[0].replace(/^ /, '');
      cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
    }
  }
  return cookies;
}

/* Get one particular cookie */
function jayway_getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
  }
  return "";
}

/* Return the key and value for all cookies with a key that matches the pattern */
function jayway_searchCookie(pattern) {
  var output = [];
  var count = 0;
  var cookies = jayway_getCookies();
  for (let [key, value] of Object.entries(cookies)) {
    var n = key.indexOf(pattern);
    if (n == 0) {
      output[key] = value;
      count++;
    }
  }
  if (count == 0) {
    return(0);
  }
  else {
    return(output);
  }
}


/* Simple function to format a number into money */
function jayway_formatMoney(n, x = 0) {
  var number = parseFloat(n);
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (number > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~number)).replace(new RegExp(re, 'g'), '$&,');
}



