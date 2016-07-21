/* See license.txt for terms of usage */

"use strict";

const { Cc, Ci, components } = require("chrome");

// The only responsibility of the 'main' module is loading
// 'toolbox-overlay' that is responsible for the Network
// panel customization.
require("./my-toolbox.js");

function onLoad(options, callbacks) {
};

function onUnload(reason) {
};

// Exports from this module
exports.main = onLoad;
exports.onUnload = onUnload;
