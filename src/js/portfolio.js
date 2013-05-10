/*
  Copyright 2013 Weswit Srl

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// Lightstreamer Portfolio Demo
// Table Management

//////////////// Portfolio Table Management

// the current portfolio should be chosen by the user according to the user profile;
// in this sample, user authentication is not included and a single portfolio is
// shared among all the connected users
var portfolioId = "portfolio1";

// portfolio contents; provided by the PORTFOLIO_ADAPTER in COMMAND mode
var fieldList = ["key", "command", "qty"];

// stock quote details; provided by the QUOTE_ADAPTER in MERGE mode
var secondLevelFieldList = ["stock_name", "last_price", "time"];

// cell highlighting time (milliseconds)
var hotTime = 500;

// fade effect (can be activated with trailing "fade=ON" in URL
var doFade = (location.search.indexOf("fade=ON") > -1);
var fadeTime = 300;

// will contain a reference to the DynaGrid instance
var portfolioGrid = null;

//////////////// Grid Sort Management

var initialSort = "stock_name";
var direction = false; // true = decreasing; false = increasing; null = no sort

function changeSort(sortOn) {
  var sortedBy = portfolioGrid.getSortField();
  if (sortOn == sortedBy) {
    if (direction == false) {
      direction = true;
      document.getElementById("img_" + sortOn).src = "images/down.gif";
    } else if (direction == true) {
      direction = null;
      document.getElementById("img_" + sortOn).src = "images/spacer.gif";
      document.getElementById("col_" + sortOn).className = "tableTitle";
    } else {
      direction = false;
      document.getElementById("img_" + sortOn).src = "images/up.gif";
    }
  } else {
    direction = false;
    if (sortedBy != null) {
      document.getElementById("img_" + sortedBy).src = "images/spacer.gif";
      document.getElementById("col_" + sortedBy).className = "tableTitle";
    }
    document.getElementById("img_" + sortOn).src = "images/up.gif";
    document.getElementById("col_" + sortOn).className = "tableTitleSorted";
  }

  if (direction == null) {
    portfolioGrid.setSort(null);
  } else {
    if (sortOn == "qty" || sortOn == "last_price" || sortOn == "c_value") {
      portfolioGrid.setSort(sortOn, direction, true, false);
    } else {
      portfolioGrid.setSort(sortOn, direction);
    }
  }
}

//////////////// Subscription and Grid setup

require(["js/lsClient","Subscription","DynaGrid"], function(lsClient,Subscription,DynaGrid) {

  portfolioGrid = new DynaGrid("portfolio",true);
  portfolioGrid.setAutoCleanBehavior(true,false);
  portfolioGrid.addListener({
    onVisualUpdate: function(key,info) {
      if (info == null) {
        return;
      }
      // visual effects on updates
      info.setHotTime(hotTime);
      if (doFade) {
        info.setHotToColdTime(fadeTime);
      }

      info.setStyle("lshot", "lscold");
      info.setCellStyle("qty", "lshotq", "lscoldq");
      info.setCellStyle("stock_name", "lshotl", "lscoldl");
      info.setAttribute("#ffff66", null, "backgroundColor");
      
      var calc = false;
      var qty = info.getChangedFieldValue("qty") || portfolioGrid.getValue(key,"qty");
      var price = info.getChangedFieldValue("last_price") || portfolioGrid.getValue(key,"last_price");

      // the countervalue field ("c_value") is calculated and added
      // to the grid model
      if (price != null) { //as price is from the second level it is not available on the first updates.
        var cValue = qty * price;
        if (cValue !=  portfolioGrid.getValue("last_price")) {
          portfolioGrid.updateRow(key,{c_value:cValue});
        }
      }
      
      // format timestamp
      var time = info.getChangedFieldValue("time");
      if (time != null) {
        info.setCellValue("time", formatTime(time));
      }

      // format prices
      formatNumber("last_price", info);
      formatNumber("c_value", info);
    }
  });
  // let's define the initial sorting column
  changeSort(initialSort);
  
  var portfolioSubscription = new Subscription("COMMAND",portfolioId,fieldList);
  portfolioSubscription.setDataAdapter("PORTFOLIO_ADAPTER");
  portfolioSubscription.setRequestedSnapshot("yes");
  portfolioSubscription.setCommandSecondLevelDataAdapter("QUOTE_ADAPTER");
  portfolioSubscription.setCommandSecondLevelFields(secondLevelFieldList);
  
  portfolioSubscription.addListener(portfolioGrid);
  lsClient.subscribe(portfolioSubscription);
});


//////////////// Formatting Functions

// convert time format from [0-24] to [0-12] (without AM/PM)
function formatTime(val) {
  var a = new Number(val.substring(0,val.indexOf(":")));
  if (a > 12) {
    a -= 12;
  }
  var b = val.substring(val.indexOf(":"),val.length);
  return a + b;
}

// format a decimal number to a fixed number of decimals
function formatDecimal(value, decimals, keepZero) {
  if (isNaN(value)) {
  	// this server-side demo Data Adapter uses "," as a decimal separator
    value = convertCommaToDot(value);
  }
  var mul = new String("1");
  var zero = new String("0");
  for (var i = decimals; i > 0; i--) {
    mul += zero;
  }
  value = Math.round(value * mul);
  value = value / mul;
  var strVal = new String(value);
  if (!keepZero) {
    return strVal;
  }

  var nowDecimals = 0;
  var dot = strVal.indexOf(".");
  if (dot == -1) {
    strVal += ".";
  } else {
    nowDecimals = strVal.length - dot - 1;
  }
  for (var i = nowDecimals; i < decimals; i++) {
    strVal = strVal + zero;
  }

  return strVal;
}

// replace "," with "."
function convertCommaToDot(value) {
  var strValue = new String(value);
  if (strValue.indexOf(",") > -1 ) {
    var strValue=strValue.replace(",",".");
  }
  return new Number(strValue);
}

// helper function for onChangingValues event handlers
function formatNumber(field, info, perc, decimals) {
  var newValue = info.getChangedFieldValue(field);
  if (newValue == null) {
    return;
  }

  if (!decimals) {
    decimals = 2;
  }

  var formattedVal = formatDecimal(newValue, decimals, true);

  if (perc) {
    if (formattedVal > 0) {
      formattedVal = "+" + formattedVal;
    }
    formattedVal += "%";
  }
  info.setCellValue(field,formattedVal);
}