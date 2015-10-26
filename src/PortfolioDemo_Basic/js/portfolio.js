/*
  Copyright (c) Lightstreamer Srl

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

// Lightstreamer Basic Portfolio Demo
// Table Management

//////////////// Portfolio Table Management

// the current portfolio should be chosen by the user according to the user profile;
// in this sample, user authentication is not included and a single portfolio is
// shared among all the connected users
var portfolioId = "portfolio1";

// portfolio contents; provided by the PORTFOLIO_ADAPTER in COMMAND mode
var fieldList = ["key", "command", "qty"];

// cell highlighting time (milliseconds)
var hotTime = 500;

// will contain a reference to the DynaGrid instance
var portfolioGrid = null;

//////////////// Grid Sort Management

var initialSort = "key";
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
    if (sortOn == "qty") {
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
      info.setStyle("lshot", "lscold");
      info.setCellStyle("command", "commandhot", "commandcold")
    }
  });
  // let's define the initial sorting column
  changeSort(initialSort);
  
  var portfolioSubscription = new Subscription("COMMAND",portfolioId,fieldList);
  portfolioSubscription.setDataAdapter("PORTFOLIO_ADAPTER");
  portfolioSubscription.setRequestedSnapshot("yes");
  
  portfolioSubscription.addListener(portfolioGrid);
  lsClient.subscribe(portfolioSubscription);
});