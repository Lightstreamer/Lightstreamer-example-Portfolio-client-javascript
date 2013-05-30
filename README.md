
Lightstreamer Portfolio Demo Client for JavaScript
==================================================

This project includes three different demo:

* Basic Portfolio Demo
* Portfolio Demo
* Drop-Down Demo

Basic Portfolio Demo
--------------------

In the Basic Portfolio Demo, a virtual stock portfolio, shared among all the connected users, is displayed. By using the "Submit Order" panel, you can buy or sell a stock (identified by an item number), filling in the Quantity field and pressing the proper button. Click on the column headers to sort the grid on different columns.
The portfolio grid is updated in push mode, for both the columns and the rows (this is the so called "metapush" feature). This portfolio is shared among all the connected users, so you can connect to this demo from different machines (or try at least different browsers on the same machine), then submit orders from one browser and see the updates displayed on another browser.
The front-end code can be considered a reference example of item subscriptions in COMMAND mode.

* A [Subscription](http://www.lightstreamer.com/docs/client_javascript_uni_api/Subscription.html) containing 1 item, subscribed to in COMMAND mode feeding a [DynaGrid](http://www.lightstreamer.com/docs/client_javascript_uni_api/DynaGrid.html). Each row of the grid is identified by a unique key. For didactic purpose, this example displays the command and key fields, which are usually hidden.
* The order submission is done by sending a message directly to Lightstreamer Server using the [LightstreamerClient.sendMessage](http://www.lightstreamer.com/docs/client_javascript_uni_api/LightstreamerClient.html#sendMessage) utility.

Portfolio Demo
--------------

This demo application extends the [Basic Portfolio Demo](http://www.lightstreamer.com/demos#PortfolioDemo_Basic) by combining live stock prices as in the [Stock-List Demos](http://www.lightstreamer.com/demos#StockListDemo_Basic) with the portfolio contents.
The columns show: stock name, last price, quantity (number of stocks in the portfolio), countervalue (=price*quantity), time of last price.

The portfolio content is the same as the [Basic Portfolio Demo](http://www.lightstreamer.com/demos#PortfolioDemo_Basic) (i.e. it subscribes to the same item from the same Data Adapter) and it is shared among all the connected users. Again, you can connect to this demo from different machines and see your operations propagated everywhere.
The front-end code can be considered a reference example of item subscriptions in COMMAND mode with "two-level push".

Compared to the [Basic Portfolio Demo](http://www.lightstreamer.com/demos#PortfolioDemo_Basic) a panel has been added to display information about the submission of orders. It displays your orders only and not those submitted by other connected users. The columns show: progressive number of order, stock name, type of order (buy or sell), quantity, and status of order (SUBMITTING, PROCESSED, ABORT, DENY, DISCARDED, ERROR).

* A [Subscription](http://www.lightstreamer.com/docs/client_javascript_uni_api/Subscription.html) containing 1 item, subscribed to in COMMAND mode feeding a [DynaGrid](http://www.lightstreamer.com/docs/client_javascript_uni_api/DynaGrid.html). Each added row automatically provokes an underlying subscription to a sub-item in MERGE mode, to get the real-time price for that specific stock from another feed (the same as the Stock-List Demos). When a row is deleted, the underlying sub-item is automatically unsubscribed from.
* The order submission is done by sending a message directly to Lightstreamer Server using the [LightstreamerClient.sendMessage](http://www.lightstreamer.com/docs/client_javascript_uni_api/LightstreamerClient.html#sendMessage) utility.
* A [DynaGrid](http://www.lightstreamer.com/docs/client_javascript_uni_api/DynaGrid.html) is fed dynamically with one row for each sendMessage invocation and updated via an appropriate [ClientMessageListener](http://www.lightstreamer.com/docs/client_javascript_uni_api/ClientMessageListener.html).

Drop-Down Demo
--------------

This demo application shows a changeable list of items within a normal HTML drop-down menu. The contents of the list change in real time, based on the commands pushed by the Server.
The feed that controls the list contents is the same as in the Portfolio Demos (i.e. it subscribes to the same item from the same Data Adapter) and it is shared among all the connected users. So, you can see the drop-down menu kept in sync across all the browsers connected to this page.

The front-end code can be considered a reference example of visualization of data, coming from an item subscription, that does not leverage the Lightstreamer widgets, but uses custom HTML code or third-party widgets.

* A [Subscription](http://www.lightstreamer.com/docs/client_javascript_uni_api/Subscription.html) containing 1 item, subscribed to in COMMAND mode. Each time the Server sends an "add" or "delete" command, the JavaScript code manipulates the drop-down menu to update its contents.

Run The Demos
-------------

Before you can run the demos some dependencies need to be solved:

-  Get the lightstreamer.js file from the [Lightstreamer 5 Colosseo distribution](http://www.lightstreamer.com/download) 
   and put it in the src/<Demo>/js folder of the demo. Alternatively you can build a lightstreamer.js file from the 
   [online generator](http://www.lightstreamer.com/distros/Lightstreamer_Allegro-Presto-Vivace_5_0_Colosseo_20120803/Lightstreamer/DOCS-SDKs/sdk_client_javascript/tools/generator.html).
   In that case be sure to include the LightstreamerClient, Subscription, DynaGrid and StatusWidget modules and to use the "Use AMD" version.
-  Get the require.js file form the [requirejs.org](http://requirejs.org/docs/download.html) and put it in the src/<Demo>/js folder of the demo.

You can deploy these demos in order to use the Lightstreamer server as Web server or in any external Web Server you are running. 
If you choose the former case please note that in the <LS_HOME>/pages/demos/ folder there is a copy of the src/PortfolioDemo, src/PortfolioDemo_Basic, and src/DropDownDemo directories of this project (If it is not your case, please create the folders <LS_HOME>/pages/demos/PortfolioDemo, <LS_HOME>/pages/demos/PortfolioDemo_Basic, and <LS_HOME>/pages/demos/DropDownDemo then copy here the contents of the src/PortfolioDemo, src/PortfolioDemo_Basic, and src/DropDownDemo folders of this project). The client demos configuration assume that Lightstreamer Server, Lightstreamer Adapters and this client are launched on the same machine.
If you need to targeting a different Lightstreamer server please search this line in lsClient.js:
```js
var lsClient = new LightstreamerClient(protocolToUse+"//localhost:8080","DEMO");
```
and change it accordingly. 
Anyway the PORTFOLIO_ADAPTER, QUOTE_ADAPTER (only for PortfolioDemo), PortfolioMetadataAdapter have to be deployed in your local Lightstreamer server instance. The factory configuration of Lightstreamer server already provides this adapters deployed.
The demos are now ready to be launched. You can find demostrations hosted in our servers here: [PortfolioDemo_Basic](http://www.lightstreamer.com/demo/PortfolioDemo_Basic/), [PortfolioDemo](http://www.lightstreamer.com/demo/PortfolioDemo/), and [DropDownDemo](http://www.lightstreamer.com/demo/DropDownDemo/).

See Also
--------

* [Lightstreamer Portfolio Demo Adapter](https://github.com/Weswit/Lightstreamer-example-Portfolio-adapter-java)
* [Lightstreamer StockList Demo Adapter](https://github.com/Weswit/Lightstreamer-example-Stocklist-adapter-java)
* TODO: add link to GitHub project of [Lightstreamer StockList Demo Client for JavaScript]

Lightstreamer Compatibility Notes
---------------------------------

- Compatible with Lightstreamer JavaScript Client library version 6.0 or newer.