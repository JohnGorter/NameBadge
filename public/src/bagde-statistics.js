import '/node_modules/@polymer/polymer/polymer.js';
import {  Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const htmlTemplate = `
`;

export class BadgeStatistics extends PolymerElement {
    static get template() {}
    static get properties() {
        return {}
    }

   connectedCallback(){
     super.connectedCallback(); 
   }

   storePulse(){
       if ("deviceid" in localStorage) {
           firebase.database().ref("logins/" + localStorage["deviceid"]).set({
               LastSeen:new Date().toString(),
               Username:localStorage["username"] || "onbekend",
               UserAgent: navigator.userAgent
           });
       } else {
           firebase.database().ref("logins").push({
               LastSeen:new Date().toString(),
               Username:localStorage["username"] || "onbekend",
               UserAgent: navigator.userAgent
           }).then(snapshot => {
               localStorage["deviceid"] = snapshot.key;
           });
       }

   }
   storeStatistic(item){
       firebase.database().ref("statistics").push(item);
   }
   storeLog(item, type){
    let logitem = { created:new Date().toString(), item, type};
    firebase.database().ref("logging").push(logitem);
}
}

customElements.define('badge-statistics', BadgeStatistics);