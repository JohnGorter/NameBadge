// @ts-check


// todo:
// optie om de data te pushen
// optie om de cache te clearen en nieuwe versie te pushen
// detailscherm voor de profielen maken
// knop voor verzoek om materiaal mailen..
// site voorzien van service worker en manifest.json

import { Element as PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import './badge-includes.js';

var template = `
       <style is="custom-style" include="app-styles"> 
        .hide { display:none;height:0px;}
        app-toolbar { transition: all 0.5s ease;top:0px;}
        app-toolbar.hidden  { top:-64px;}
        #tabs { transition: height 0.5s ease;position:fixed;bottom:0px;width:100vw;height:40px;--paper-tabs-selection-bar-color: #040356; background-color:#040356;}
        #tabs.hidden { position:fixed;bottom:-40px;width:100vw;height:40px;}
        iron-icon { --iron-icon-fill-color:white}
        paper-dialog iron-icon { --iron-icon-fill-color:black}
        .scannercontainer { height:100vh;position:absolute;top:0px;width:100vw;display:flex;align-items:center;justify-content:center;background-color:var(--tint-color);}
        a { text-decoration:none;color:black;}
       </style>
       <custom-style>
            <style is="custom-style" include="paper-material-styles"></style>
       </custom-style>

       <badge-tutorial id="tutorial" on-badge-scanned="badgescanned" class="hide" ></badge-tutorial>

       <app-header-layout>
            <app-header id="header" slot="header" condenses fixed effects="waterfall">
               <app-toolbar id="toolbar" style="padding:0px;">
               <div class="logo" style="flex:1"><img src="/images/smartbadgeicon.png"><span on-tap="_clearCache"> Version 7 </span></div>
               <template is="dom-if" if="[[_showSearch(selpage)]]">
               <paper-icon-button icon="search" on-tap="_search"></paper-icon-button>
                </template>
               </app-toolbar>
           </app-header>
          <!-- <div class="main" on-tap="nextPage">   
                <div class="textplace" id="textplace">
                    <div id="title" class$="{{_getStepClass(step)}}">{{_getStepTitle(registration.*, step)}}</div>
                    <div id="details">{{_getStepDetails(step)}}</div>
                </div>
            </div> -->
            <button style="position:absolute;top:300px;"  on-tap="hideTabs">hide tabs</button>
            <iron-pages selected="{{selpage}}">
                <div class="scannercontainer"><badge-scanner id="scanner" on-badge-scanned="badgescanned" ></badge-scanner></div>
                <badge-presentation id="presentation" emailaddress="{{emailaddress}}" items="{{items}}" filter="{{filter}}" itemslastvisited="{{lastvisited}}" selected="{{selectedgrid}}" on-basic-info="basicinfo" on-more-info="moreinfo"></badge-presentation>
                <badge-schedule on-show-details="_showDetails" id="schedule" schedule="[[schedule]]" only-me="[[onlyMe]]"filter="{{sessiefilter}}"></badge-schedule>
                <badge-news items="[[newsitems]]"></badge-news>
            </iron-pages>
       </app-header-layout>

       <badge-filter filter="{{filter}}" show="{{_shouldShow(selpage, selectedgrid)}}"></badge-filter>

       <paper-dialog id="nomatchDialog" style="background-color: white;" modal>
            <h2>Sorry</h2>
            <div style="margin-bottom:50px;">Het scannen heeft geen resultaten opgeleverd.</div>
            <div class="buttons" style="position:relative;border-top:1px solid #d8d5d5;background-color: white;">
                <span style="user-select: none;margin:10px;color:var(--tint-color)" dialog-dismiss>Sluiten</span>
            </div>
       </paper-dialog>

       <badge-moreinfo id="moredialog" on-claim-user="_claimUser"></badge-moreinfo>
       <badge-basicinfo id="basicdialog" on-close="_closebasicinfo"></badge-basicinfo>
       <badge-prompt on-close="_setFilter" id="seachprompt" header="Zoeken naar" content="Geef hieronder uw zoekargument op" label="zoeken naar"></badge-prompt>
       <badge-eventdetails id="eventdetails" on-session-review="_storerating"></badge-eventdetails>
       <badge-confirm id="confirm" header="Bent u deze persoon?" on-close="_saveClaimUser"></badge-confirm>
      <!-- <badge-review id="review" on-close="_sendMailRequest" on-cancel="_sendMailRequest"></badge-review>
       <badge-registeremail id="personalise" emailaddress="{{emailaddress}}" on-close="_showReview"></badge-registeremail>
       <badge-mailrequest id="mailrequest"></badge-mailrequest> -->

       <paper-tabs id="tabs" selected="{{selpage}}">
            <paper-tab><iron-icon icon="image:center-focus-weak" ></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="image:grid-on" ></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="schedule" ></iron-icon></paper-tab>
            <paper-tab><img src="./images/twitter.svg" style="fill:white" height="24" width="24"></paper-tab>
       </paper-tabs>

       <ico-app api-key="AIzaSyC-0AJ2JrHirZ7cKPojEUks26Fftcb12JA"  auth-domain="iconica-sbadge.firebaseapp.com" database-U-R-L="https://iconica-sbadge.firebaseio.com" project-id="iconica-sbadge" storage-bucket="iconica-sbadge.appspot.com" messaging-sender-id="319820458930"></ico-app>

       <!-- <ico-query path="registrations" get-initial-data="[[getInitialRegistrations]]" source="localstorage" data="{{items}}"></ico-query> -->
       <ico-query id="lastvisited" path="lastvisited" source="localstorage" get-initial-data="[[getInitialLastVisited]]" data="{{lastvisited}}"></ico-query>

       <badge-statistics id="statistics"></badge-statistics>
        <ico-query id="newsitems" path="newsitems/items" data="{{newsitems}}"></ico-query>
       <ico-document id="doc" path="registrations"></ico-document>
       <ico-storage-item id="item" ref="videos/{{filename}}" data="{{video}}" on-fileuploaded="_videouploaded" url="{{videourl}}"></ico-storage-item>
       <ico-storage-item id="item" ref="thumbs/{{filename}}" data="{{thumb}}" on-fileuploaded="_thumbuploaded" url="{{thumburl}}"></ico-storage-item>
       <ico-auth id="auth" user="{{user}}"></ico-auth>

`;

export class BadgeApp extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    static get observers() { return ['_fillAgenda(agenda.*, items.*, emailaddress, cachedschedule.*)']}
    static get properties(){ return {
        emailaddress: { type:String },
        step: { type:Number, value:-1, notify:true},
        registration: { type:Object, value:{}},
        items: { type:Array},
        schedule: { type:Array},
        lastvisited: { type:Array },
        selpage: { type:Number, value:1},
        filter: { type:String, value:'["a","b","c","d"]'},
        sessiefilter: { type:String, value:''},
        onlyMe: { type:Boolean, value:false}
    }}

    _clearCache(){
        console.log('clearing cache');
        console.log('cache', window.caches['sbadge-precache']);
    }

    _search() {
        var title = this.selpage == 1 ? "Zoeken naar deelnemers" : "Zoeken naar sessies";
        this.$.seachprompt.open(title, "Geef hieronder de term of een deel van de term waar u naar op zoek bent, in het onderstaande invulveld op.", "zoeken naar", "");
    }
    _setFilter(e) {
        if (this.selpage == 1)
            this.filter = e.detail.value;
        else
            this.sessiefilter = e.detail.value;
    }
    _showSearch(page){
        return page == 1 || page == 2;
    }
    _shouldShow(selpage, selectedgrid) {
        return selpage == 1 && selectedgrid == 0;
    }

    _storerating(e) {
        let username = localStorage["username"];
        this.$.statistics.storeStatistic({
            type:'Rating',
            from: username,
            session: e.detail.event,
            rating: e.detail.rating
        });
    }
   _claimUser(e){
       if (this.emailaddress != "") return;
       this.moreinfoItem = e.detail.item;
       this.$.confirm.open("Personaliseer de SmartBadge app", "Bevestig alstublieft uw mailadres. Is dit uw email adres: " + e.detail.item.Email);
   }
   _saveClaimUser(){
       localStorage["user"]= this.moreinfoItem.Email;
       localStorage["username"]= this.moreinfoItem.Username;
       this.$.tutorial.importing = true;
       setTimeout(() => {
         this.emailaddress = this.moreinfoItem.Email;
         this.$.tutorial.complete();
       }, 500); 
       
   }

   _filter(){
       this.onlyMe = !this.onlyMe;
   }

   _findItemById(id){
        var item = undefined;
        for (var hour of this.schedule){
            for (var scheduleitem of hour.items)
                if (scheduleitem.id == id)
                    return scheduleitem;
        }
   }
   _showDetails(e){
        var item = this._findItemById(e.detail.event);
        if (item)
           this.$.eventdetails.open(item, e.detail.hour);
    }

    badgescanned(e){
       
        let found = this.items.find((item) => item.Username == e.detail);
        if (!found) {
            this.$.nomatchDialog.open();
            this.$.statistics.storeLog(`Scan of badge failed, could not scan badge ${e.detail}`, `error`);
        }
        else {
            let username = localStorage["username"];
            if (!username) {
                this.$.statistics.storeStatistic(
                { 
                    type:'Registration',
                    from:found.Username,
                });
            }
            else {
                this.$.statistics.storeStatistic(
                { 
                    type:'Connection',
                    source:'Scan',
                    from:username,
                    to:found.Username
                });
            }
            this.$.moredialog.open(found, this.emailaddress);
        }
    }

    basicinfo(e){
        this.$.basicdialog.open(e.detail.item, e.detail.unlock);
    }
    _closebasicinfo(e){
        if (e.detail.confirmed){
            let item = this.lastvisited.find((item) => item.Username == e.detail.item.Username);
            if (!item){
                let username = localStorage["username"];
                this.$.statistics.storeStatistic(
                    { 
                        type:'Connection',
                        source:'Grid',
                        from:username,
                        to:e.detail.item.Username
                    }
                );
                this.lastvisited = [e.detail.item, ...this.lastvisited];
            }
            this.$.moredialog.open(e.detail.item, this.emailaddress);
        } 
    }

    getInitialLastVisited() {
        return [];
    }

    connectedCallback(){
        super.connectedCallback();
        window.performance.mark('mark_fully_loaded');
        this.emailaddress = window.localStorage["user"] || "";
        setTimeout(() => {
            if (this.$.tutorial.completed == "")
                this.$.tutorial.classList.remove("hide");
        }, 0); 
        if ("registrationcount" in localStorage)    
            this.registrationcount =  parseInt(localStorage["registrationcount"]);
        
        if (!("registrations" in localStorage)){
            firebase.database().ref("registrations").once("value", (s) => {
                let val = s.val(); 
                if (val)
                    localStorage["registrations"] = JSON.stringify(Object.values(val));
                    this.items = [
                        ...(localStorage["onsite_registrations"] ? JSON.parse(localStorage["onsite_registrations"]) : []),
                        ...(localStorage["registrations"] ? JSON.parse(localStorage["registrations"]) : [])];
            });
        };

        if (!("agenda" in localStorage)){
            firebase.database().ref("agenda").once("value", (s) => {
                let val = s.val(); 
                if (val)
                    localStorage["agenda"] = JSON.stringify(Object.values(val));
                    this.agenda = JSON.parse(localStorage["agenda"]);
            });
        }

        if (!("schedule" in localStorage)){
            firebase.database().ref("schedule").once("value", (s) => {
                let val = s.val(); 
                if (val)
                    localStorage["schedule"] = JSON.stringify(Object.values(val));
                    this.cachedschedule = JSON.parse(localStorage["schedule"]);
            });
        }

        if (!("onsite_registrations" in localStorage)){
            firebase.database().ref("onsite_registrations").once("value", (s) => {
                let val = s.val(); 
                if (val)
                    localStorage["onsite_registrations"] = JSON.stringify(Object.values(val));
                    this.items = [
                        ...(localStorage["onsite_registrations"] ? JSON.parse(localStorage["onsite_registrations"]) : []),
                        ...(localStorage["registrations"] ? JSON.parse(localStorage["registrations"]) : [])];
            });
        }
        if (("onsite_registrations" in localStorage) ||
            ("registrations" in localStorage)) {
                this.items = [
                    ...(localStorage["onsite_registrations"] ? JSON.parse(localStorage["onsite_registrations"]) : []),
                    ...(localStorage["registrations"] ? JSON.parse(localStorage["registrations"]) : [])];
            }

        if ("agenda" in localStorage) {
            this.agenda = [
                ...(localStorage["agenda"] ? JSON.parse(localStorage["agenda"]) : [])];
        }
        
        if ("schedule" in localStorage) {
            this.cachedschedule = [
                ...(localStorage["schedule"] ? JSON.parse(localStorage["schedule"]) : [])];
        }

        setInterval(() => {
            // check to see if there are changes...
            this._syncData(); 
        }, 5000);
    }

    _fillAgenda(){
        if ("agenda_filled" in localStorage) { this.schedule = this.cachedschedule ;return;}
        if (this.emailaddress && this.items && this.agenda){
            let profile = this.items.find(i => i.Email == this.emailaddress);
            console.log("user", profile.UserID);
            if (profile) {
                let agenda = this.agenda.find(a => a.user == profile.UserID);
                if (agenda) {
                    for (let item of agenda.agenda){
                        localStorage["event_" + item + "_mark"] = "1";
                    }
                }
                localStorage["agenda_filled"] = "true";
                console.log("setting schedule...");
                this.schedule = this.cachedschedule;
            }
        }
    }

    _syncData(){
        firebase.database().ref("appversion").once('value', snapshot => {
            let version = snapshot.val(); 
            if (version && localStorage["version"] != version)
            {
                localStorage["version"] = version;
                window.caches.delete("iconica-sbadge");
                location.reload(); 
            }
        }); 
        firebase.database().ref("registrationcount").once('value', (snapshot)=>{
            let val = snapshot.val();
            if (val){
                var count = parseInt(val); 
                // if the counter has increased.... we have new data...
                if (this.registrationcount != count) {
                    // grab new data
                    firebase.database().ref("onsite_registrations").once('value', (snapshot)=>{
                        ("snapshot taken, store it in localstorage");
                        localStorage["onsite_registrations"] = JSON.stringify(Object.values(snapshot.val())); 
                        this.items = [
                            ...(localStorage["onsite_registrations"] ? JSON.parse(localStorage["onsite_registrations"]) : []),
                            ...(localStorage["registrations"] ? JSON.parse(localStorage["registrations"]) : [])];
            
                    });  
                    this.registrationcount = count;
                    localStorage["registrationcount"] = count;
                }
            }
        });
    }


    // nextPage(){
    //     this.$.auth.signInAnonymously();
    // }

    _hasToolbar(){
        return window.outerHeight < (screen.height-24);
    }
}

customElements.define('badge-app', BadgeApp);