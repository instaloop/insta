/**
 * @file
 */

(function ($, Drupal) {
  "use strict";

Drupal.behaviors.wsStuffer = {
  attach: function(context, settings) {
    if (typeof $.cookie !== 'undefined') {
      var myref;
      var external;

      // Determine if the referer is external or internal
      var backlink = document.createElement("a");
      backlink.href = document.referrer;
      if (!backlink.hostname.match(/wordstream\.com$/) && backlink.hostname) {
        myref = document.referrer;
        external = true;
      }
      else if (backlink.hostname == 'local.wordstream.com') {
        // This is a local dev server, so assume it's external to aid testing
        myref = document.referrer;
        external = true;
      }
      else {
        myref = "ws_local";
        external = false;
      }

      // Get the current page and timestamp
      var request_uri = location.pathname + location.search;
      var current = request_uri.replace(/\//g, "");
      var dateObject = new Date();
      var timestamp = dateObject.getTime();

      // Find where to insert referrers into the list
      var limit = 10;
      var nextc = 1;
      var i;
      for (i = 1; i < limit; i++) {
        var c = "myref_" + i;
        if ($.cookie(c)) {
          nextc = i+1;
        }
      }

      // Get a list of _GET parameters
      var parts = window.location.search.substr(1).split("&");
      var url_params = {};
      for (var i = 0; i < parts.length; i++) {
        var temp = parts[i].split("=");
          url_params[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
      }

      // Set ad campaign cookies
      if (external) {
        var mycmp = "none";
        if ("cmp" in url_params) {
          mycmp = url_params["cmp"];
        }

        var mysrc = "none";
        if ("src" in url_params) {
          mysrc = url_params["src"];
        }

        var expiry = timestamp+60*60*24*29.5*12*24;
        $.cookie("myref_" + nextc, myref, { expires: expiry, path: "/", domain: ".wordstream.com" });
        $.cookie("mycmp", mycmp, { expires: expiry, path: "/", domain: ".wordstream.com" });
        $.cookie("mysrc", mysrc, { expires: expiry, path: "/", domain: ".wordstream.com" });
        $.cookie("tstamp", timestamp, { expires: expiry, path: "/", domain: ".wordstream.com" });
      }

      // Record when on homepage
      if (current === "") {
        current = "/";
      }

      // Set page visit history cookies
      var mynav = "";
      var last = "";
      if ($.cookie("navp")) {
        mynav = $.cookie("navp");
        if (typeof mynav === "string") {
          var navarr = mynav.split(" > ");
          if (navarr.length) {
            last = navarr[navarr.length - 1];
          }

          // Only store the last 10 visited pages.
          if (navarr.length > 10) {
            navarr = navarr.slice(-10);
          }
          navarr.push(current);
          mynav = navarr.join(' > ');
        }
      }

      // Set navp cookie
      if (last.trim() !== current.trim()) {
        mynav += " > ";
        $.cookie("navp", mynav, { path: "/", domain: ".wordstream.com" });
      }
    }
  }
}

})(jQuery, Drupal);
