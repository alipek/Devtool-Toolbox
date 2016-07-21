/**
 * Created by Andrzej Lipka on 21.07.2016.
 */

"use strict";

const {Cu} = require("chrome");
const { gDevTools } = Cu.import("resource:///modules/devtools/gDevTools.jsm", {});
const { devtools } = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
const {NetUtil} = Cu.import("resource://gre/modules/NetUtil.jsm", {});
const {FilePicker} = require('./filepicker');
let {RestRequest} = require("./xml-export");


const MyToolbox = {
  /**
   * Executed when a new toolbox is ready. There is one instance
   * of the toolbox per browser tab (created when the user opens
   * the toolbox UI).
   */
  onInit: function(eventId, toolbox) {
    this.onNetPanelReady = this.onNetPanelReady.bind(this);
    this.exportPhpStormRestRequest = this.exportPhpStormRestRequest.bind(this);
    toolbox.getPanelWhenReady("netmonitor").then(this.onNetPanelReady);
  },


  onNetPanelReady: function(panel) {
    let doc = panel.panelWin.document;

    this.netPanel = panel;

    let button = doc.createElement("button");
    button.className = "headers-summary-method";
    button.id = "requests-menu-rest-xml-button"
    button.tooltip = "REST XML";
    button.className = "devtools-toolbarbutton";
    button.setAttribute("label", "REST XML");
    button.addEventListener("command", this.exportPhpStormRestRequest, false);

    let footer = doc.getElementById("headers-summary-version");
    footer.appendChild(button);
  },
  
  exportPhpStormRestRequest: function () {
    let win = this.netPanel.panelWin;
    let RequestsMenu = win.NetMonitorView.RequestsMenu;


    let selected = RequestsMenu.selectedItem.attachment;
    let requestXml = new RestRequest(this.netPanel.panelWin.document.createElement("handle"), selected);
    let xmlString = requestXml.asString();
    
    FilePicker.save(xmlString);
  }
};

// Registration
gDevTools.on("toolbox-created", MyToolbox.onInit.bind(MyToolbox));

// Exports from this module
exports.MyToolbox = MyToolbox;
