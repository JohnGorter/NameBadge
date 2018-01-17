"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// generate fake data for tests
var http = require("http");
var vm = require("vm");
var firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
function loadModule(urls) {
    var retval = [];
    urls.forEach(function (url) {
        console.log("add new promise");
        retval.push(new Promise(function (res, rej) {
            http.get(url, function (resp) {
                if (resp.statusCode === 200) {
                    var rawData_1 = '';
                    resp.setEncoding('utf8');
                    resp.on('data', function (chunk) { rawData_1 += chunk; });
                    resp.on('end', function () { vm.runInThisContext(rawData_1); res(); });
                }
                else {
                    console.log('no data');
                    rej();
                }
            });
        }));
    });
    console.log("returning empty list");
    return Promise.all(retval);
}
var config = {
    apiKey: "AIzaSyAIrU1xKfGnsX2Pa40idv-9uGLnomiMyp4",
    authDomain: "rep-app-dcb15.firebaseapp.com",
    databaseURL: "https://rep-app-dcb15.firebaseio.com",
    projectId: "rep-app-dcb15",
    storageBucket: "rep-app-dcb15.appspot.com",
    messagingSenderId: "991032175500"
};
firebase.initializeApp(config);
loadModule(['http://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js'])
    .then(function () {
    console.log('modules loaded');
    for (var i = 0; i < 4000; i++) {
        var name = faker.name.findName();
        var comp = faker.company.companyName();
        var data = { company: comp, thumburl: faker.image.avatar(), username: name, videourl: '' };
        firebase.firestore().collection("registrations").add(data).then(function () { return console.log("data saved"); }).catch(function () { return console.log("data not saved!"); });
        console.log("saved new entry");
    }
});
