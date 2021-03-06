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
        .scannercontainer { height:100vh;position:fixed;top:0px;width:100vw;display:flex;align-items:center;justify-content:center;background-color:#f5f5f5;}
        a { text-decoration:none;color:black;}
       </style>
       <custom-style>
            <style is="custom-style" include="paper-material-styles"></style>
       </custom-style>

       <badge-tutorial id="tutorial" on-badge-scanned="badgescanned" class="hide" ></badge-tutorial>
       <badge-flipper id="flipcontainer">
       <div slot="front">
        <app-header-layout>
                <app-header id="header" slot="header" condenses fixed effects="waterfall">
                <app-toolbar id="toolbar" style="padding:0px;">
                <div class="logo" style="flex:1"><img src="/images/smartbadgeicon.png"></div>
                <paper-icon-button icon="settings" on-tap="_settings"></paper-icon-button>
                <template is="dom-if" if="[[_showSearch(selpage)]]">
                <paper-icon-button icon="search" on-tap="_search"></paper-icon-button>
                    </template>
                </app-toolbar>
            </app-header>
                <iron-pages selected="{{selpage}}">
                    <div class="scannercontainer"><div style="border: 1px solid white; border-right: 1px solid gray; border-bottom: 1px solid gray;background-color:white;"><badge-scanner id="scanner" on-badge-scanned="badgescanned" message="Klik hier om de QR-code van een willekeurige badge te scannen" ></badge-scanner></div></div>
                    <badge-presentation activeusers="[[activeusers]]" id="presentation" user="{{user}}" items="{{items}}" filter="{{filter}}" itemslastvisited="{{lastvisited}}" selected="{{selectedgrid}}" on-basic-info="basicinfo" on-error="_logError" on-more-info="moreinfo"></badge-presentation>
                    <badge-schedule on-show-details="_showDetails" id="schedule" schedule="[[schedule]]" only-me="[[onlyMe]]"filter="{{sessiefilter}}"></badge-schedule>
                    <badge-news id="news" icon="{{icon}}" page="[[selpage]]" on-state-change="_newtweet" items="[[newsitems]]"></badge-news>
                </iron-pages>
        </app-header-layout> 
       

       <badge-filter filter="{{filter}}" show="{{_shouldShow(selpage, selectedgrid)}}"></badge-filter>
    <!--    <template is="dom-if" if="[[_shouldShow(selpage, selectedgrid)]]">
    //     <paper-fab label="[[activeusers]] deelnemers actief nu"></paper-fab>
    //    </template> -->

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
       <badge-eventdetails id="eventdetails" on-session-review="_storerating" on-register-slides="_registerForSlides"></badge-eventdetails>
       <badge-confirm id="confirm" header="Bent u deze persoon?" on-close="_saveClaimUser"></badge-confirm>
      <!-- <badge-review id="review" on-close="_sendMailRequest" on-cancel="_sendMailRequest"></badge-review> -->
       <badge-registeremail id="personalise" user="{{user}}" email="{{email}}" on-close="_sendRequest"></badge-registeremail><!--
       <badge-mailrequest id="mailrequest"></badge-mailrequest> -->

       <paper-tabs id="tabs" selected="{{selpage}}">
            <paper-tab><iron-icon icon="image:center-focus-weak" ></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="image:grid-on" ></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="schedule" ></iron-icon></paper-tab>
            <paper-tab><img src="./images/[[icon]]" style="fill:white" height="24" width="24"> </paper-tab>
       </paper-tabs>
        </div>
        <div slot="back">
          <div style="background-color:#232323;top:0px;position:fixed;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
            <div style="background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:250px;margin:5%;align-self:center;">
            
            <div>
                <div style="padding:15px">
                <h1>[[header]]</h1>
                <p>[[content]]</p>
            </div>
            <div style=" position:absolute;bottom:0px;height: 64px; width: 100%;">
                <hr style="0.5px solid silver" />
                <span on-tap="_close" style="width: 50px;text-align: center;user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);" dialog-dismiss>Opslaan</span>
                <span on-tap="_cancel" style="user-select: none; margin: 10px;right: 80px;position: absolute; color: var(--tint-color);" dialog-dismiss>Sluiten</span>
            </div>
            </div>
       </div>
        
        
        </div>
       </badge-flipper>
 

       <ico-app api-key="AIzaSyC-0AJ2JrHirZ7cKPojEUks26Fftcb12JA"  auth-domain="iconica-sbadge.firebaseapp.com" database-U-R-L="https://iconica-sbadge.firebaseio.com" project-id="iconica-sbadge" storage-bucket="iconica-sbadge.appspot.com" messaging-sender-id="319820458930"></ico-app>

     <!-- <ico-query path="registrations" get-initial-data="[[getInitialRegistrations]]" source="localstorage" data="{{items}}"></ico-query> -->

       <ico-query id="lastvisited" path="lastvisited" source="localstorage" get-initial-data="[[getInitialLastVisited]]" data="{{lastvisited}}"></ico-query>


       <badge-statistics id="statistics"></badge-statistics>
        <ico-query id="newsitems" path="newsitems/items" data="{{newsitems}}"></ico-query>
`;

export class BadgeApp extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    static get observers() { return ['_fillAgenda(agenda.*, items.*, user, cachedschedule.*)']}
    static get properties(){ return {
        user: { type:String },
        step: { type:Number, value:-1, notify:true},
        registration: { type:Object, value:{}},
        items: { type:Array},
        schedule: { type:Array},
        activeusers: { type:Number, value:0 },
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

    _newtweet(){
        this.$.news.getIcon();
    }
    _settings(){
        this.$.flipcontainer.flip();
    }
    _cancel(){
         this.$.flipcontainer.flip();
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
        let user = this.items.find(u => u.Username == username);
        if (!user) { user = { Username: "", PersonaName:"Onbekend"}};

        this.$.statistics.storeStatistic(
            { "Rating:": {
                created:new Date().toString(),
                type:'Rating',
                from: user.PersonaName,
                session: e.detail.event,
                rating: e.detail.rating
            }});
    }
   _claimUser(e){
       if (this.user != "") return;
       this.moreinfoItem = e.detail.item;
       this.$.confirm.open("Personaliseer de SmartBadge app", "Bevestig alstublieft uw profiel. Is dit uw naam: " + e.detail.item.Username);
   }
   _saveClaimUser(){
      // localStorage["user"]= this.moreinfoItem.Email;
       localStorage["username"]= this.moreinfoItem.Username;
       this.$.tutorial.importing = true;
       setTimeout(() => {
         this.user = this.moreinfoItem.Username;
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
           this.$.eventdetails.open(item, e.detail.hour, e.detail.marked);
    }
    _logError(e) {
        this.$.statistics.storeLog(e.detail, `error`);
    }

    badgescanned(e){
        let username = localStorage["username"] || "Onbekend";
        let found = this.items.find((item) => item.Username == e.detail);
        let user = this.items.find(u => u.Username == username);
         if (!user) { user = { Username: "", PersonaName:"Onbekend"}};

        if (!found) {
            this.$.nomatchDialog.open();
            this.$.statistics.storeLog(`Scan of badge failed, could not scan badge ${e.detail}`, `error`);
        }
        else {
            if (!username) {
                this.$.statistics.storeStatistic(
                { "Registration" : 
                    { 
                        created:new Date().toString(),
                        type:'Registration',
                        from:found.Username,
                        fromProfileType:found.PersonaName
                    }
                });
                this.$.moredialog.open(found, this.user, true);
            }
            else {
                if (this._storeNewConnection(found)) {
            
                    this.$.statistics.storeStatistic(
                        { "ScanConnection" :
                            { 
                                created:new Date().toString(),
                                type:'Connection',
                                source:'Scan',
                                from:user.PersonaName,
                                to:found.PersonaName
                            }
                        });
                }
                this.$.moredialog.open(found, this.user, false, user.PersonaName);
            }
        }
    }

    _storeNewConnection(connection){
        let newitem = this.lastvisited.find((item) => item && item.Username == connection.Username);
        if (!newitem) {
            this.lastvisited = [connection, ...this.lastvisited];
            return true;
        }
        return false;
    }

    _registerForSlides(e){
        this.slideregisterdetails = e.detail;
        this.$.personalise.open(); 
    }

    _sendRequest() {
        let username = localStorage["username"];
        if (this.email) {
            this.$.statistics.storeStatistic(
                {
                    "RequestForSlides":
                    { 
                        created:new Date().toString(),
                        from:this.email,
                        session:this.slideregisterdetails.item,
                        sessionid:this.slideregisterdetails.EventId
                    }
                });
        }
    }

    basicinfo(e){
        this.$.basicdialog.open(e.detail.item, e.detail.unlock);
    }
    _closebasicinfo(e){
        if (e.detail.confirmed){
            let username = localStorage["username"];
            let user = this.items.find(u => u.Username == username);
            if (!user) { user = { Username: "", PersonaName:"Onbekend"}};
            if (this._storeNewConnection(e.detail.item)) {
                this.$.statistics.storeStatistic(
                    { "GridConnection" : 
                        { 
                            created:new Date().toString(),
                            type:'Connection',
                            source:'Grid',
                            from:user.PersonaName,
                            to:e.detail.item.PersonaName
                        }
                    }
                );
            }
            this.$.moredialog.open(e.detail.item, this.user, user.PersonaName);
        } 
    }

    getInitialLastVisited() {
        return [];
    }

    connectedCallback(){
        super.connectedCallback();
        window.performance.mark('mark_fully_loaded');
        this.user = window.localStorage["username"] || "";
        setTimeout(() => {
            // if (this.$.tutorial.completed == "")
            //     this.$.tutorial.classList.remove("hide");
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

        this.user = localStorage["username"] || "onbekend";
       
        this.$.statistics.storePulse();
        firebase.database().ref("logins").once('value', (snapshot) => {
            var logins = snapshot.val(); 
            if (logins) {
                let counter = 0; 
                for (let login in logins){
                    if (new Date() - Date.parse(logins[login].LastSeen) < 300000) 
                    {
                        counter++;
                    }
                }
                this.activeusers = counter;
            }
        });

        setInterval(() => {
            // check to see if there are changes...
            console.log("sync data");
            this.$.statistics.storePulse();
            this._syncData(); 
        }, 60000);
    }

    _fillAgenda(){
        if ("agenda_filled" in localStorage || this.user || "onbekend") { this.schedule = this.cachedschedule ;return;}
        if (this.user && this.items && this.agenda){
            let profile = this.items.find(i => i.Username == this.user);
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
                navigator.serviceWorker.controller.postMessage("clearcache");
                setTimeout(() =>{
                    location.reload(true); 
                }, 1000);
            }
        }); 
        firebase.database().ref("logins").once('value', (snapshot) => {
            var logins = snapshot.val(); 
            if (logins) {
                let counter = 0; 
                for (let login in logins){
                    if (new Date() - Date.parse(logins[login].LastSeen) < 300000) 
                    {
                        counter++;
                    }
                }
                this.activeusers = counter;
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