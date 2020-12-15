const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // console.log(`CHECKING VARIABLE fs.readdirSync(exports.dataDir): ${Array.isArray((fs.readdirSync(exports.dataDir)))}`);
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          throw ('error writing todo item');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};


exports.readAll = (callback) => {
  //retrieve contents of data
  //map filename to text and id
  //get array with readdir
  //iterate through array creating new objects with key value pair of filename for each file
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      if (files.length === 0) {
        callback(null, []);
      } else {
      /*
      // Iterate over files using _.map and assign result to filesArray
      // Set variable to substring of just id number of each item
      // Create object literal named currentFile with id substring as value of id and text properties
      // Return currentFile
      // Call callback and pass in null and filesArray
      */
        let filesArray = _.map(files, (file) => {
          let fileNumber = file.substring(0, 5);
          let currentFile = { id: fileNumber, text: fileNumber};
          return currentFile;
        });
        callback(null, filesArray);
      }
    }
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
