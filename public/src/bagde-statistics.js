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

   storeStatistic(item){
       firebase.database().ref("statistics").push(item);
   }
   storeLog(item, type){
    let logitem = { created:new Date().toString(), item, type};
    firebase.database().ref("logging").push(logitem);
}
}

customElements.define('badge-statistics', BadgeStatistics);