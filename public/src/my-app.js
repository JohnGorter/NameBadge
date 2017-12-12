// @ts-check

import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import '/node_modules/@polymer/paper-button/paper-button.js'
import '/node_modules/@polymer/iron-icons/iron-icons.js'
import '/node_modules/@polymer/paper-icon-button/paper-icon-button.js'
import '/node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js'
import '/node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js'
import '/node_modules/@polymer/app-layout/app-header/app-header.js'
import '/node_modules/@polymer/paper-progress/paper-progress.js'
import '/node_modules/@polymer/iron-pages/iron-pages.js'

import '/node_modules/@iconica/iconicaelements/ico-authentication.js'
import '/node_modules/@iconica/iconicaelements/ico-app.js'
import '/node_modules/@iconica/iconicaelements/ico-grid.js'
import '/node_modules/@iconica/iconicaelements/ico-query.js'
import '/node_modules/@iconica/iconicaelements/ico-document.js'
import '/node_modules/@iconica/iconicaelements/ico-storage-item.js'

import './iconica-presentation.js'

var template = `
       <style>
        :host { font-family: 'Roboto'; } 
        app-toolbar { background-color:var(--main-toolbar-bg-color, #101654);color:var(--main-color, white);}
        .main { display:flex;flex-wrap:wrap;align-content:flex-start;align-items:flex-start;font-family: 'Roboto', sans-serif;color:var(--main-color, white); background-color:var(--main-bg-color, #101654); width:100vw; height:95vh;}
        .textplace { font-size:42px;padding-top:26vh;padding-left:20px;padding-bottom:15px;min-width:100vw;transition:padding-top 0.1s ease-in-out;}
        .textplace.step1 { font-size:42px;padding-top:7vh;padding-left:20px;min-width:100vw;}
        .textplace.step3 { font-size:42px;padding-top:20vh;padding-left:20px;min-width:100vw;}
        #title {font-size:7vw; font-weight: 500}
        #title.larger { font-size:10vw; font-weight: 500;}
        #details { font-size:2.8vw;margin-top:5px;}
        .small { font-size:14px}
        .hidden { opacity:0;}
        
        ico-registration { z-Index:20;}
        ico-presentation { z-index:10;width:100vw;height:90vh;top:10vh;position:absolute;background-color:#0082c9;overflow:scroll;}
       </style>
       <app-header-layout>
            <app-header slot="header" fixed condenses effects="waterfall">
               <app-toolbar><div style="flex:1"><img height="52" src="/images/smartbadgeicon.png"></div><paper-icon-button icon="lock" on-tap="nextPage"></paper-icon-button></app-toolbar>
           </app-header>
           <div class="main">   
                <div class="textplace" id="textplace">
                    <div id="title" class$="{{_getStepClass(step)}}">{{_getStepTitle(step)}}</div>
                    <div id="details">{{_getStepDetails(step)}}</div>
                </div>
            </div>
            <ico-presentation id="presentation" items="{{items}}"></ico-presentation>
            <ico-registration id="registration" username="{{username}}" step="{{step}}" on-registration-complete="_saveRegistration"></ico-registration>
       </app-header-layout>

       <ico-app api-key="AIzaSyAIrU1xKfGnsX2Pa40idv-9uGLnomiMyp4"  auth-domain="rep-app-dcb15.firebaseapp.com" database-URL="https://rep-app-dcb15.firebaseio.com" project-id="rep-app-dcb15" storage-bucket="rep-app-dcb15.appspot.com" messaging-sender-id="991032175500"></ico-app>
       <ico-query path="registrations" data="{{items}}"></ico-query>
       <ico-document id="doc" path="registrations"></ico-document>
       <ico-storage-item id="item" ref="videos/{{filename}}" data="{{video}}" on-fileuploaded="_videouploaded" url="{{url}}"></ico-storage-item>
       <ico-auth id="auth" user="{{user}}"></ico-auth>

`;

export class MyApp extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    
    static get properties(){ return {
        step: { type:Number, value:-1, notify:true},
        items: { type:Array, value:[]},
    }}

    connectedCallback(){
        super.connectedCallback();
        this.titles = ["Get on board!","Hallo {{username}}!", "","Kies de foto voor op je badge"];
        this.details = ["","Wij willen je [badge] graag voorzien van je bedrijfsnaam", "", "Wij hebben speciaal voor jou een selectie foto's gemaakt"];
        this.title = this.titles[0];
        this.detail = this.details[0];
        import('./iconica-presentation.js');
    }

    _getStepClass(step) {
        return step < 1 ? "larger": "";
    }

    _getStepTitle(step){
        if (step == -1) return "Get on board!";
        if (step >= 0)
            this.$.textplace.classList.add("step"+step);
        if (step >= 0 && this.titles.length > this.step)
            return (step >= 0)? this.titles[step].replace("{{username}}", this.username) : "";
        return "";
    }

    _getStepDetails(step){
        if (step >= 0 && this.details.length > this.step)
            return (step >= 0)? this.details[step] : "";
        return "";
    }

    nextPage(){
        this.$.auth.signInAnonymously();
        this.$.presentation.hidden = !this.$.presentation.hidden;
        import('./iconica-registration.js').then(() => {
            this.$.registration.start();
        });
    }

    _hasToolbar(){
        return window.outerHeight < (screen.height-24);
    }

    _videouploaded(e){
        // REMOVE THE VIDEO FROM THE OBJECT, IT WAS SAVED TO STORAGE
        delete this.registrationdata.video;
        delete this.registrationdata.thumbs;
        // INSERT THE URL TO THE VIDEO FROM STORAGE INTO THE REGISTRATIONDATA
        this.registrationdata.videourl = this.url;
        this.$.doc.docid = this.registrationdata.username;
        this.$.doc.data = this.registrationdata;
    }

    _saveRegistration(e){
        // EXTRACT THE VIDEO BLOB AND SAVE IT IN STORAGE
        this.registrationdata = e.detail;
        this.filename = e.detail.username;
        this.video = this.registrationdata.video;
    }

    _selectVideo(){
        console.log("video selected");
    }


}

customElements.define('my-app', MyApp);