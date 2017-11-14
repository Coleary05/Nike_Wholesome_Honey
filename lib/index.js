"use strict";

var _stores = require("./stores");

var _stores2 = _interopRequireDefault(_stores);

var _locations = require("./locations");

var _locations2 = _interopRequireDefault(_locations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

  var defaultText = "Amazon";

  function makeHTTPCall(url, cb) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        return cb(xhttp.responseText);
      } else if (this.status != 200 && this.readyState == 4) {
        return cb({ error: true });
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  }

  function placeAd(code) {
    var ahalogyAdSpace = document.getElementById('ahalogy_adspace');
    ahalogyAdSpace.innerHTML = "<img src=\"https://s3.amazonaws.com/ada-widget/Nike2/images/" + nameToImage(code) + ".jpg\">";
    ahalogyAdSpace.querySelector('img').style = "max-width:330px";
  }

  function getZipByIp(ip, cb) {
    makeHTTPCall("//pro.ip-api.com/json/" + ip + "?key=08Sp36Zjx1ULrk9", function (data) {
      return cb(data);
    });
  }

  function getIP(cb) {
    makeHTTPCall("//api.ipify.org", function (data) {
      return cb(data);
    });
  }

  function nameToImage(name) {

    switch (name) {
      case 'Ahold Delhaize':
        return "Ahold";
        break;
      case 'Hannaford':
        return "Hannaford";
        break;
      case 'Whole Foods':
        return "Whole";
        break;
      case 'Natural Retailers':
        return "NaturalRetailers";
        break;
      case 'Target':
        return "Target";
        break;
      case 'Giant Eagle':
        return "Giant";
        break;
      case 'Kroger':
        return "Kroger";
        break;
      case 'Sprouts':
        return "Sprouts";
        break;
      case 'Natural Grocers':
        return "NaturalGrocers";
        break;
      case "Raley's":
        return "Raleys";
        break;
      default:
        return "Amazon";
        break;
    }
  }

  function getAdByZip() {
    var customerZipcode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!customerZipcode) {
      placeAd(defaultText);
      return;
    }

    console.log("GOT YOUR ZIPCODE AS: " + customerZipcode);

    // See if our zip matches any in the data.
    var code = _stores2.default.filter(function (zip) {
      if (String(zip.zip_code).indexOf('-') > -1) {
        var split = zip.zip_code.split('-');
        zip.zip_code = split[0];
      }
      if (String(zip.zip_code) == String(customerZipcode)) return zip;
      return false;
    });

    console.log("Stores", code);

    if (!code.length) {
      placeAd(defaultText);
      return;
    }

    var number = Math.floor(Math.random() * code.length);
    placeAd(code[number].company);
  }

  getIP(function (IP) {
    if (IP.error) return getAdByZip(false);
    getZipByIp(IP, function (data) {
      if (IP.error) return getAdByZip(false);
      var newData = JSON.parse(data);
      getAdByZip(newData.zip);
    });
  });
})(_stores2.default, _locations2.default);