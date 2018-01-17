// generate fake data for tests
import * as http from 'http';
import * as vm from 'vm';

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

declare let faker:Faker.FakerStatic;

function loadModule(urls:[string]) : Promise<void[]> { 
    let retval:Promise<void>[]=[];
    urls.forEach((url) => {
            console.log("add new promise");
            retval.push (new Promise((res,rej) => {
                http.get(url, resp => {
                        if (resp.statusCode === 200) {
                            let rawData = '';
                            resp.setEncoding('utf8');
                            resp.on('data', chunk => { rawData += chunk; });
                            resp.on('end', () => { vm.runInThisContext(rawData); res(); });
                        } else {
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
.then(() => {
    console.log('modules loaded');
    for (let i = 0; i < 4000; i++){
        let name = faker.name.findName();
        let comp = faker.company.companyName();
        
        let data = {company:comp, thumburl:faker.image.avatar(), username:name, videourl:''};
        
        
        firebase.firestore().collection("registrations").add(data).then(() => console.log("data saved")).catch(() => console.log("data not saved!"));
        console.log("saved new entry");
    }
});
