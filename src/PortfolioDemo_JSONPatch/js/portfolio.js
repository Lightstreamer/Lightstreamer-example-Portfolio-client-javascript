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

// portfolio contents; provided by the PORTFOLIO_JSON_ADAPTER in MERGE mode
var jsonField = "json";

//////////////// Subscription and tree setup

require(["js/lsClient","Subscription"], function(lsClient,Subscription) {

  var lastJsonObj = {};
  var textDiv = $('#original');
  var patchDiv = $('#json-patch-tree');
  var treeDiv = $('#json-tree');

  var portfolioSubscription = new Subscription("MERGE",[portfolioId],[jsonField]);
  portfolioSubscription.setDataAdapter("PORTFOLIO_JSON_ADAPTER");
  portfolioSubscription.setRequestedSnapshot("yes");
  
  portfolioSubscription.addListener({
    onItemUpdate: function(itemUpdate) {
      var jsonText = itemUpdate.getValue(jsonField);
      textDiv.html(jsonText);
      var jsonObj = JSON.parse(jsonText);
      treeDiv.jsonViewer(jsonObj);
      var jsonPatch = itemUpdate.getValueAsJSONPatchIfAvailable(jsonField);
      if (jsonPatch != null) {
        // assert (jsonObj = apply(jsonPatch, lastJsonObj));
        patchDiv.jsonViewer(jsonPatch);
      } else {
        patchDiv.text("N/A");
      }
      lastJsonObj = jsonObj;
    }
  });

  lsClient.subscribe(portfolioSubscription);
});