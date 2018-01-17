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
       <style is="custom-style" include="app-styles"></style>
       <app-header-layout>
            <app-header slot="header" fixed condenses effects="waterfall">
               <app-toolbar><div class="logo" style="flex:1"><img src="/images/smartbadgeicon.png"></div>
                <paper-icon-button icon="view-list" on-tap="nextPage"></paper-icon-button>
                <paper-icon-button icon="settings-overscan" on-tap="scan"></paper-icon-button>
               </app-toolbar>
           </app-header>
           <div class="main">   
                <div class="textplace" id="textplace">
                    <div id="title" class$="{{_getStepClass(step)}}">{{_getStepTitle(registration.*, step)}}</div>
                    <div id="details">{{_getStepDetails(step)}}</div>
                </div>
            </div>
            <ico-scanner id="scanner" hidden>scanner
                <div id="scanwindow"></div>
            </ico-scanner>
            <ico-presentation id="presentation" items="{{items}}"></ico-presentation>
            <ico-registration id="registration" registrationdata="{{registration}}" username="{{username}}" step="{{step}}" on-registration-complete="_saveRegistration"></ico-registration>
       </app-header-layout>

       <ico-app api-key="AIzaSyAIrU1xKfGnsX2Pa40idv-9uGLnomiMyp4"  auth-domain="rep-app-dcb15.firebaseapp.com" database-URL="https://rep-app-dcb15.firebaseio.com" project-id="rep-app-dcb15" storage-bucket="rep-app-dcb15.appspot.com" messaging-sender-id="991032175500"></ico-app>
       <ico-query path="registrations" data="{{items}}"></ico-query>
       <ico-document id="doc" path="registrations"></ico-document>
       <ico-storage-item id="item" ref="videos/{{filename}}" data="{{video}}" on-fileuploaded="_videouploaded" url="{{videourl}}"></ico-storage-item>
       <ico-storage-item id="item" ref="thumbs/{{filename}}" data="{{thumb}}" on-fileuploaded="_thumbuploaded" url="{{thumburl}}"></ico-storage-item>
       <ico-auth id="auth" user="{{user}}"></ico-auth>

`;

export class MyApp extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    
    static get properties(){ return {
        step: { type:Number, value:-1, notify:true},
        registration: { type:Object, value:{}},
        items: { type:Array, value:[]},
    }}

    connectedCallback(){
        super.connectedCallback();
       
        this.titles = ["Get on board!","Hallo {{registration.username}}!", "","Kies de foto voor op je badge"];
        this.details = ["","Wij willen je [badge] graag voorzien van je bedrijfsnaam", "", "Wij hebben speciaal voor jou een selectie foto's gemaakt"];
        this.title = this.titles[0];
        this.detail = this.details[0];
        import('./iconica-presentation.js');
    }

    _getStepClass(step) {
        return step < 1 ? "larger": "";
    }

    _getStepTitle(data, step){
        if (step == -1) return "Get on board!";
        if (step >= 0){
            this.$.textplace.classList.remove("step"+(step-1));
            this.$.textplace.classList.add("step"+step);
        }
        if (step >= 0 && this.titles.length > this.step)
            return (step >= 0)? this.titles[step].replace("{{registration.username}}", this.registration.username) : "";
        return "";
    }

    _getStepDetails(step){
        if (step >= 0 && this.details.length > this.step)
            return (step >= 0)? this.details[step] : "";
        return "";
    }
    scan(){
        this.$.presentation.hidden = true;
        this.$.registration.hidden = true;
       // import('./iconica-scanner.js').then(() => {
         //   this.$.scanner.start();
            this.$.scanner.hidden = false;
       // });

       Quagga.init({
        inputStream : {
          name : "Live",
          type : "LiveStream",
          target: this.$.scanwindow    // Or '#yourElement' (optional)
        },
        decoder : {
          readers : ["code_128_reader"]
        }
      }, function(err) {
          if (err) {
              console.log(err);
              return
          }
          console.log("Initialization finished. Ready to start");
          Quagga.start();
      });
      Quagga.onDetected((data) =>{
          console.log("data", data);
      });
    }

    nextPage(){
        this.$.scanner.hidden = true;
        this.$.auth.signInAnonymously();
        this.$.presentation.hidden = !this.$.presentation.hidden;
        import('./iconica-registration.js').then(() => {
            this.$.registration.start();
            this.$.registration.hidden = !this.$.presentation.hidden;
        });
    }

    _hasToolbar(){
        return window.outerHeight < (screen.height-24);
    }

    _thumbuploaded(e){
         this.registrationdata.thumburl = this.thumburl;
         if (this.registrationdata.videourl)
             this._completeregistration();
    }

    _videouploaded(e){
        this.registrationdata.videourl = this.videourl;
        if (this.registrationdata.thumburl)
            this._completeregistration();
    }

    _completeregistration(){
        // REMOVE THE BINARIES FROM THE OBJECT, IT WAS SAVED TO STORAGE
        delete this.registrationdata.video;
        delete this.registrationdata.thumbs;
        delete this.registrationdata.thumb;
        // INSERT THE URL TO THE VIDEO FROM STORAGE INTO THE REGISTRATIONDATA
        this.registrationdata.videourl = this.videourl;
        this.$.doc.docid = this.registrationdata.username;
        this.$.doc.data = this.registrationdata;
    }

    _saveRegistration(e){
        // EXTRACT THE VIDEO BLOB AND SAVE IT IN STORAGE
        this.$.textplace.classList.remove("step"+this.step);
        this.registrationdata = e.detail;
        this.filename = e.detail.username;
        fetch(this.registrationdata.thumb).then(res => res.blob()).then(blob => {this.thumb = blob;
            console.log(this.thumb);
            this.video = this.registrationdata.video;
        }).catch((error) => {
            console.log("error fetching thumb ", error)
        });
    }

    _selectVideo(){
    }


}

customElements.define('my-app', MyApp);