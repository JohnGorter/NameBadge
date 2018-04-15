// @ts-check
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

       <badge-tutorial id="tutorial" class="hide" ></badge-tutorial>

       <app-header-layout>
            <app-header id="header" slot="header" condenses fixed effects="waterfall">
               <app-toolbar id="toolbar" style="padding:0px;"><div class="logo" style="flex:1"><img src="/images/smartbadgeicon.png"></div>
               <paper-icon-button icon="search" on-tap="_search"></paper-icon-button>
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

       <paper-dialog style="background-color:#232323;top:0px;position:absolute;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="moredialog" style="margin:10px" on-iron-overlay-closed="moreclose">
            <div style="background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:95%;margin:5%">
            <div style="display:flex;position:relative;width:100%;height:130px;background-color:white;">
                <div style="margin:25px;border-radius:50%;width:100px;height:100px; background:url('[[_getImage(moreinfoItem.Photo,moreinfoItem.CompanyLogo)]]');background-size:100% 100%"></div>
                <div>
                    <h1 style="color:var(--tint-color);font-size:20px;margin-top: 25px;margin-bottom: -8px;">[[moreinfoItem.Username]]</h1>
                    <h2 style="color:var(--tint-color);font-size:16px;;margin-bottom: 5px;">[[moreinfoItem.Company]]</h2>
                    <p style="margin:0px;"><iron-icon style="margin-right:10px;" icon="communication:email"></iron-icon><a href="mailto:[[moreinfoItem.Email]]">[[moreinfoItem.Email]]</a></p>
                    <p style="margin:0px;"><iron-icon style="margin-right:10px;" icon="communication:phone"></iron-icon><a href="tel:[[moreinfoItem.Telefoonnummer]]">[[moreinfoItem.Telefoonnummer]]</a></p>
                </div>
            </div>
            <div>
                <div style="padding:15px">
                <span style="color:var(--tint-color);">[[moreinfoItem.company]] Omschrijving</span><br/>
                <p style="margin:0px">[[moreinfoItem.OmschrijvingBedrijf]]</p><br/>
                <span style="color:var(--tint-color);">Sector</span><br/>
                <p style="margin:0px">[[moreinfoItem.Sectors]]</p><br/>
                <span style="color:var(--tint-color);">Business model</span><br/>
                <p style="margin:0px">[[moreinfoItem.BusinessModel]]</p><br/>
                <span style="color:var(--tint-color);">Ik zou graag mensen willen ontmoeten die mij toegang bieden tot</span><br/>
                <p style="margin:0px">[[moreinfoItem.Meet]]</p><br/>
                <span style="color:var(--tint-color);">Waaraan ga ik deelnemen</span><br/>
                <p style="margin:0px">[[moreinfoItem.Interests]]</p>
               
                </div>
            </div>
            <div style="display:flex;position:absolute;bottom:0px;height:54px;padding-top:10px;width:100%;border-top:1px solid #d8d5d5;background-color: white;">
                
                <span on-tap="_claimUser" class$="{{_canClaim(emailaddress)}}" style="left:10px;position:absolute;user-select: none;margin:10px;color:var(--tint-color)" dialog-dismiss>Dit ben ik..</span>
                <span style="user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);" dialog-dismiss>Sluiten</span>
            </div>
            </div>
       </paper-dialog>
       <badge-basicinfo id="basicdialog" on-close="_closebasicinfo"></badge-basicinfo>
       <badge-prompt on-close="_setFilter" id="seachprompt" header="Zoeken naar" content="Geef hieronder uw zoekargument op" label="zoeken naar"></badge-prompt>
       <badge-eventdetails id="eventdetails"></badge-eventdetails>
       <badge-confirm id="confirm" header="Bent u deze persoon?" on-close="_saveClaimUser"></badge-confirm>
      <!-- <badge-review id="review" on-close="_sendMailRequest" on-cancel="_sendMailRequest"></badge-review>
       <badge-registeremail id="personalise" emailaddress="{{emailaddress}}" on-close="_showReview"></badge-registeremail>
       <badge-mailrequest id="mailrequest"></badge-mailrequest> -->

       <paper-tabs id="tabs" selected="{{selpage}}">
            <paper-tab><iron-icon icon="image:center-focus-weak" ></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="image:grid-on" ></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="schedule" ></iron-icon></paper-tab>
            <paper-tab><iron-icon icon="announcement" ></iron-icon></paper-tab>
       </paper-tabs>

       <ico-app api-key="AIzaSyD22SNSB6S5EVQqbT1XYQ2Xn0iMQGOk-iA"  auth-domain="woe-dag.firebaseapp.com" database-U-R-L="https://woe-dag.firebaseio.com" project-id="woe-dag" storage-bucket="woe-dag.appspot.com" messaging-sender-id="576477840466"></ico-app>

       <!-- <ico-query path="registrations" get-initial-data="[[getInitialRegistrations]]" source="localstorage" data="{{items}}"></ico-query> -->
       <ico-query id="lastvisited" path="lastvisited" source="localstorage" get-initial-data="[[getInitialLastVisited]]" data="{{lastvisited}}"></ico-query>

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
    _shouldShow(selpage, selectedgrid) {
        return selpage == 1 && selectedgrid == 0;
    }
    _canClaim(){
        return this.emailaddress != "" ? "hidden" : ""
    }
   _claimUser(){
       if (this.emailaddress != "") return;
       //console.log('claimed', this.moreinfoItem.email);
       this.$.confirm.open("Personaliseer de NameBadge app", "Bevestig alstublieft uw email adres. Is dit uw email adres: " + this.moreinfoItem.Email);
   }
   _saveClaimUser(){
       localStorage["user"]= this.moreinfoItem.Email;
       this.emailaddress = this.moreinfoItem.Email;
       this.$.tutorial.complete();
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
        //console.log('badge scanned:', e.detail );
        let found = this.items.find((item) => item.Username == e.detail);
        if (!found)
            this.$.nomatchDialog.open();
        else
            this.moreinfo({detail:{item:found}});
    }

    basicinfo(e){
        this.$.basicdialog.open(e.detail.item, e.detail.unlock);
    }
    _closebasicinfo(e){
        if (e.detail.confirmed){
            //this.$.moredialog.open();
            this.moreinfo(e);
        } 
    }

    moreinfo(e) {
        this.moreinfoItem = e.detail.item;
        this.$.moredialog.open();
        let item = this.lastvisited.find((item) => item.Username == e.detail.item.Username);
        if (!item)
            this.lastvisited = [e.detail.item, ...this.lastvisited];
    }

    _getImage(Photo, CompanyLogo){
        if (CompanyLogo != "n/a" && CompanyLogo.length > 0) return CompanyLogo;
        if (Photo != "n/a" && Photo.length > 0) return Photo;
        return "/images/nophoto.jpg";
    }

    getInitialLastVisited() {
    //    console.log('no data available, so returning new data..');
        return [];
    }

    connectedCallback(){
        super.connectedCallback();
        window.performance.mark('mark_fully_loaded');
        this.emailaddress = window.localStorage["user"] || "";
       // import('./badge-presentation.js');
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
                    localStorage["agenda_filled"] = "true";
                    console.log("setting schedule...");
                    this.schedule = this.cachedschedule
                }
            }
        }
    }

    // _findSessionById(id){
    //     for (var s of this.schedule){
    //         for (var i of s.items)
    //             if (i.id == id) return i;
    //     }
    //     return undefined;
    // }

    _syncData(){
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
        hideTabs(){
            if (this.tabshidden) {
              //  this.$.tabs.classList.remove("hidden");
                this.$.toolbar.classList.remove("hidden");
                this.tabshidden = false;
            }
            else {
              //  this.$.tabs.classList.add("hidden");
                this.$.toolbar.classList.add("hidden");
                this.tabshidden = true;
            }
        }

    nextPage(){
        this.$.auth.signInAnonymously();
    }

    _hasToolbar(){
        return window.outerHeight < (screen.height-24);
    }
}

customElements.define('badge-app', BadgeApp);