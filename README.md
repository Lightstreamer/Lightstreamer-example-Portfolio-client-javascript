
Lightstreamer Portfolio Demo Client for JavaScript
==================================================

This demo application extends the [Basic Portfolio Demo](http://www.lightstreamer.com/demos#PortfolioDemo_Basic) by combining live stock prices as in the [Stock-List Demos](http://www.lightstreamer.com/demos#StockListDemo_Basic) with the portfolio contents.
The columns show: stock name, last price, quantity (number of stocks in the portfolio), countervalue (=price*quantity), time of last price.

The portfolio content is the same as the [Basic Portfolio Demo](http://www.lightstreamer.com/demos#PortfolioDemo_Basic) (i.e. it subscribes to the same item from the same Data Adapter) and it is shared among all the connected users. Again, you can connect to this demo from different machines and see your operations propagated everywhere.
The front-end code can be considered a reference example of item subscriptions in COMMAND mode with "two-level push".

Compared to the [Basic Portfolio Demo](http://www.lightstreamer.com/demos#PortfolioDemo_Basic) a panel has been added to display information about the submission of orders. It displays your orders only and not those submitted by other connected users. The columns show: progressive number of order, stock name, type of order (buy or sell), quantity, and status of order (SUBMITTING, PROCESSED, ABORT, DENY, DISCARDED, ERROR).

Client Side Technologies
------------------------

* A [Subscription](http://www.lightstreamer.com/docs/client_javascript_uni_api/Subscription.html) containing 1 item, subscribed to in COMMAND mode feeding a [DynaGrid](http://www.lightstreamer.com/docs/client_javascript_uni_api/DynaGrid.html). Each added row automatically provokes an underlying subscription to a sub-item in MERGE mode, to get the real-time price for that specific stock from another feed (the same as the Stock-List Demos). When a row is deleted, the underlying sub-item is automatically unsubscribed from.
* The order submission is done by sending a message directly to Lightstreamer Server using the [LightstreamerClient.sendMessage](http://www.lightstreamer.com/docs/client_javascript_uni_api/LightstreamerClient.html#sendMessage) utility.
* A [DynaGrid](http://www.lightstreamer.com/docs/client_javascript_uni_api/DynaGrid.html) is fed dynamically with one row for each sendMessage invocation and updated via an appropriate [ClientMessageListener](http://www.lightstreamer.com/docs/client_javascript_uni_api/ClientMessageListener.html).

Run The Demo
------------

Before you can run the demo some dependencies need to be solved:

-  Get the lightstreamer.js file from the [Lightstreamer 5 Colosseo distribution](http://www.lightstreamer.com/download) 
   and put it in the src/js folder of the demo. Alternatively you can build a lightstreamer.js file from the 
   [online generator](http://www.lightstreamer.com/distros/Lightstreamer_Allegro-Presto-Vivace_5_0_Colosseo_20120803/Lightstreamer/DOCS-SDKs/sdk_client_javascript/tools/generator.html).
   In that case be sure to include the LightstreamerClient, Subscription, DynaGrid and StatusWidget modules and to use the "Use AMD" version.
-  Get the require.js file form the [requirejs.org](http://requirejs.org/docs/download.html) and put it in the src/js folder of the demo.

You can deploy this Demo in order to use the Lightstreamer server as Web server or in any external Web Server you are running. 
If you choose the former case please note that in the <LS_HOME>/pages/demos/PortfolioDemo folder there is a copy of the src directory of this project. The client demo configuration assume that Lightstreamer Server, Lightstreamer Adapters and this client are launched on the same machine.
If you need to targeting a different Lightstreamer server please search this line in lsClient.js:
```js
var lsClient = new LightstreamerClient(protocolToUse+"//localhost:8080","DEMO");
```
and change it accordingly. 
Anyway the PORTFOLIO_ADAPTER, QUOTE_ADAPTER, PortfolioMetadataAdapter have to be deployed in your local Lightstreamer server instance. The factory configuration of Lightstreamer server already provides this adapters deployed.
The demo is now ready to be launched. [Here](http://www.lightstreamer.com/demo/PortfolioDemo/) a demostration hosted in our servers.

See Also
--------

* TODO: add link to GitHub project of [Lightstreamer Portfolio Demo Adapter]
* TODO: add link to GitHub project of [Lightstreamer Stock-List Demo Adapter]
* TODO: add link to GitHub project of [Lightstreamer Basic Portfolio Demo Client for JavaScript]
* TODO: add link to GitHub project of [Lightstreamer Stock-List Demo Client for JavaScript]

Lightstreamer Compatibility Notes
---------------------------------

- Compatible with Lightstreamer JavaScript Client library version 6.0 or newer.