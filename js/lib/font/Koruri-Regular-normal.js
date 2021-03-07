﻿(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jspdf')) :
    typeof define === 'function' && define.amd ? define(['jspdf'], factory) :
    (global = global || self, factory(global.jspdf));
}(this, (function (jspdf) { 'use strict';
var jsPDF = jspdf.jsPDF;
var callAddFont = function () {
this.addFileToVFS('Koruri-Regular-normal.ttf', font);
this.addFont('Koruri-Regular-normal.ttf', 'Koruri-Regular', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
})));