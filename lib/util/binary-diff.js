'use strict';

var fs = require('fs');
var readChunk = require('read-chunk');
var istextorbinary = require('istextorbinary');
var dateFormat = require('dateformat');
var prettyBytes = require('pretty-bytes');
var Table = require('cli-table');

exports.isBinary = function (existingFilePath, newFileContents) {
  var existingHeader = readChunk.sync(existingFilePath, 0, 512);
  return istextorbinary.isBinarySync(undefined, existingHeader) || istextorbinary.isBinarySync(undefined, newFileContents);
};

exports.diff = function (existingFilePath, newFileContents) {
  var existingStat = fs.statSync(existingFilePath);
  var table = new Table({
    head: ['', 'Existing', 'Replacement', 'Diff']
  });

  var sizeDiff = void 0;

  if (existingStat.size > newFileContents.length) {
    sizeDiff = '-';
  } else {
    sizeDiff = '+';
  }

  sizeDiff += prettyBytes(Math.abs(existingStat.size - newFileContents.length));

  table.push(['Size', prettyBytes(existingStat.size), prettyBytes(newFileContents.length), sizeDiff], ['Last modified', dateFormat(existingStat.mtime), '', '']);

  return table.toString();
};