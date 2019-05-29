// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
try {
  var Realm = require('realm');
} catch (ex) {
  alert(ex);
}

var RealmDbContext = {
  context: function(configuration) {
    return new Realm(configuration);
  },
  realm: Realm
};

var BaseDirectory = {
  value: __dirname
};

// const os = require('os');
// const path = require('path');

// const CarSchema = {
//   name: 'Car',
//   properties: {
//     make: 'string',
//     model: 'string',
//     miles: { type: 'int', default: 0 }
//   }
// };
// const PersonSchema = {
//   name: 'Person',
//   properties: {
//     name: 'string',
//     birthday: 'date',
//     cars: { type: 'list', objectType: 'Car' },
//     picture: { type: 'data', optional: true } // optional property
//   }
// };

// // Initialize a Realm with Car and Person models
// let realm = new Realm({
//   path: path.join('C:\\', 'electron-realm-sample', 'data.realm'),
//   schema: [CarSchema, PersonSchema]
// });

// let a = realm.objects('Car');

// a.forEach(function(item) {
//   let p = document.createElement('p');
//   p.innerHTML = item.make + ', ' + item.model + ', ' + item.miles;
//   document.body.appendChild(p);
// });
