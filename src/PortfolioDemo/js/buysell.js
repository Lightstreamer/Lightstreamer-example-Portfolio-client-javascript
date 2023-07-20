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

// Lightstreamer Portfolio Demo
// Order Entry Management

// cell highlighting time (milliseconds)
var hotOrdersTime = 800;

// fade effect (can be activated with trailing "fade=ON" in URL
var doOrdersFade = (location.search.indexOf("fade=ON") > -1);
var fadeOrdersTime = 300;

//////////////// Drop-down List Composition

// The list of stocks available on the market would be normally provided
// by an application server, based on some search criteria and on the user
// profile. In this sample, we will simply hard-wire on the Client the list
// of stocks managed by the QUOTE_ADAPTER Data Adapter.

var availStocks = ["item1","item2","item3","item4","item5",
                   "item6","item7","item8","item9","item10",
                   "item11","item12","item13","item14","item15",
                   "item16", "item17", "item18", "item19", "item20",
                   "item21", "item22", "item23", "item24", "item25",
                   "item26", "item27", "item28", "item29", "item30"];

var stockNames = ["Anduct", "Ations Europe",
                  "Bagies Consulting", "BAY Corporation",
                  "CON Consulting", "Corcor PLC",
                  "CVS Asia", "Datio PLC",
                  "Dentems", "ELE Manufacturing",
                  "Exacktum Systems", "KLA Systems Inc",
                  "Lted Europe", "Magasconall Capital",
                  "MED", "Mice Investments",
                  "Micropline PLC", "Nologicroup Devices",
                  "Phing Technology", "Pres Partners",
                  "Quips Devices", "Ress Devices",
                  "Sacle Research", "Seaging Devices",
                  "Sems Systems, Inc", "Softwora Consulting",
                  "Systeria Develop", "Thewlec Asia",
                  "Virtutis", "Yahl"];

// populate the HTML select element
var select = document.getElementById("stockN");
if (select) {
  for (var i = 0; i < availStocks.length; i++) {
    var option = document.createElement("option");
    if (i == 0) {
      option.selected = true;
    }
    option.value = availStocks[i];
    option.innerHTML = stockNames[i];
    select.appendChild(option);
  }
}

//////////////// Message Listerner
var ordersGrid = null;
var prgs = 0;

function fillOrdersTable(prog, op, portfolioId, name, qtyN, status) {
  // Updating a orders grid row with status as the result of sendmessage.
  ordersGrid.updateRow(prog,{status:status});
}

//////////////// Order Submission Management

function submitForm(op) {
  var name = document.getElementById("stockN");
  var qtyN = document.getElementById("qtyN");

  if (!window.client || !window.portfolioId || !op || !name || !qtyN) {
    //this shouldn't happen
    return;
  }

  name = name.value;
  qtyN = qtyN.value;
  var stock_name = stockNames[name.substring(4)-1];

  if (!qtyN || !name) {
    alert("No empty fields admitted. Please fill the 'quantity' field and choose a stock.");
  } else {
    var wrong = false;

    if (isNaN(qtyN)) {
      alert("Only digits are admitted for the 'quantity' field. Please re-type the value.");
      return;
    }
    
    // Adding a row to orders grid with sending order data.
    var prog = ++prgs;
    ordersGrid.updateRow(prog,{side:op,prog:prog,qty:qtyN,stock:stock_name,status:"SUBMITTING"});

    var mex = op + "|" + portfolioId + "|" + name + "|" + qtyN;
    client.sendMessage(mex, "Orders", 30000, {
      onAbort: function(originalMex, snt) {
        fillOrdersTable(prog, op, portfolioId, name, qtyN, "ABORT");
      },
      onDeny: function(originalMex, code, nbr) {
        fillOrdersTable(prog, op, portfolioId, name, qtyN, "DENY");
      },
      onDiscarded: function(originalMex) {
        fillOrdersTable(prog, op, portfolioId, name, qtyN, "DISCARDED");
      },
      onError: function(originalMex) {
        fillOrdersTable(prog, op, portfolioId, name, qtyN, "ERROR");
      },
      onProcessed: function(originalMex, response) {
        fillOrdersTable(prog, op, portfolioId, name, qtyN, response);
      }
    });
  }
}

//////////////// Grid Sort Management

var initialOrdersSort = "prog";
var ordersDirection = false; // true = decreasing; false = increasing; null = no sort

function changeSortOrders(sortOn) {
  var sortedBy = ordersGrid.getSortField();
  if (sortOn == sortedBy) {
    if (ordersDirection == false) {
      ordersDirection = true;
      document.getElementById("img_ord_" + sortOn).src = "images/down.gif";
    } else if (ordersDirection == true) {
      ordersDirection = null;
      document.getElementById("img_ord_" + sortOn).src = "images/spacer.gif";
      document.getElementById("col_ord_" + sortOn).className = "tableTitle";
    } else {
      ordersDirection = false;
      document.getElementById("img_ord_" + sortOn).src = "images/up.gif";
    }
  } else {
    ordersDirection = false;
    if (sortedBy != null) {
      document.getElementById("img_ord_" + sortedBy).src = "images/spacer.gif";
      document.getElementById("col_ord_" + sortedBy).className = "tableTitle";
    }
    document.getElementById("img_ord_" + sortOn).src = "images/up.gif";
    document.getElementById("col_ord_" + sortOn).className = "tableTitleSorted";
  }

  if (ordersDirection == null) {
    ordersGrid.setSort(null);
  } else {
    if (sortOn == "qty" || sortOn == "prog") {
      ordersGrid.setSort(sortOn, ordersDirection, true, false);
    } else {
      ordersGrid.setSort(sortOn, ordersDirection);
    }
  }
}

// Orders grid pagination disable.
/*
var currentPage = 1;

function changePage(direction) {
  console.log("goto page: " + direction);
  
  if ( direction == 0 && currentPage > 1) {
    ordersGrid.goToPage(--currentPage);
  }
  
  if ( direction == 1 && currentPage < ordersGrid.getCurrentPages()) {
    ordersGrid.goToPage(++currentPage);
  }
  
  document.getElementById("pageNumber").innerHTML = " Page: " + currentPage + "/" + ordersGrid.getCurrentPages() + " ";
}*/

var client = null;
require(["js/lsClient","DynaGrid"],function(lsClient,DynaGrid) {
  //save references to the LightstreamerClient to be used to 
  //send messages
  client = lsClient;

  //enable/disable form based on the status of the connection
  lsClient.addListener({
    onStatusChange: function(newStatus) {
      if (newStatus.indexOf("CONNECTED") == 0) {
        document.getElementById("buy").disabled = false;
        document.getElementById("sell").disabled = false;
      } else {
        document.getElementById("buy").disabled = true;
        document.getElementById("sell").disabled = true;
      }
    }
  });
  
  // orders grid
  dynaGrid = new DynaGrid("orders",true);
  
  // Orders grid pagination disable.
  // dynaGrid.setMaxDynaRows(15);
  
  dynaGrid.setAutoCleanBehavior(true, false);
  dynaGrid.addListener({
    onVisualUpdate: function(key,info) {
      if (info == null) {
        return;
      }
      // visual effects on updates
      info.setHotTime(hotOrdersTime);
      if (doOrdersFade) {
        info.setHotToColdTime(fadeOrdersTime);
      }  
      
      info.setCellStyle("qty", "lshotq", "lscoldq");
      info.setCellStyle("prog", "lshotln", "lscoldln");
      info.setCellStyle("stock", "lshotl", "lscoldl");
      info.setCellStyle("status", "lshotln", "lscoldln");
      info.setCellStyle("side", "lshotc", "lscoldc")
    }    
    /*
    , onCurrentPagesChanged: function(pages) {
      console.log("Pages: " + pages);
      document.getElementById("pageNumber").innerHTML = " Page: " + currentPage + "/" + pages + " ";
    }
    */
  });
  ordersGrid = dynaGrid;
    
   // let's define the initial sorting column for orders grid
  changeSortOrders(initialOrdersSort);
});
