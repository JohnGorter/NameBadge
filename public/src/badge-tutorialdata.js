import '/node_modules/@polymer/polymer/polymer.js';
import {  Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const htmlTemplate = `
    {{ appinstall }}
`;

export class BadgeTutData extends PolymerElement {
    static get template() {}
    static get properties() {
        return {
            appinstall: {
                type:String, 
                value:'',
                notify:true,
                observer:'_setAppinstall'
            }
        }
    }

   connectedCallback(){
     super.connectedCallback(); 
     if ("appinstall" in window.localStorage)
        this.appinstall = window.localStorage["appinstall"];
   }

   _setAppinstall() {
       if (this.appinstall && this.appinstall != "")    
           window.localStorage["appinstall"] = this.appinstall;
   }
}

customElements.define('badge-tutorialdata', BadgeTutData);