import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
     <badge-statistics id="statistics"></badge-statistics>
     <paper-dialog style="z-index:60;background-color:#232323;top:0px;position:fixed;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
            <div style="display:flex;align-items:center;flex-flow:column;justify-content:flex-start;background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:95%;margin:5%">
            
                <div style="display:flex;position:relative;width:100%;height:130px;background-color:white;">
                    <div style="margin:25px;border-radius:50%;width:100px;height:100px; background:url('[[_getImage(item.Photo)]]');background-size:100% 100%"></div>
                    <template is="dom-if" if="[[_isPhoto(item.CompanyLogo)]]">
                     <div style="margin: 25px;top: 88px;left: 10px;position: fixed;background-color: white;border: 0px solid black;"> <img src="[[_getImage(item.CompanyLogo)]]" height="30"></div>
                     </template>
                    <div style="width: 40vw;right: 20px;position: fixed;">
                        <h1 style="color:var(--tint-color);font-size:4vw;margin-top: 25px;margin-bottom: -8px;">[[item.Username]]</h1>
                        <h2 style="color:var(--tint-color);font-size:3vw;margin-bottom: 5px;">[[_getCompany(item.PersonaName)]]</h2>
                        <template is="dom-if" if="[[_hasItem(user)]]">
                            <div style="margin-top:15px;display:flex;border-radius: 5px; background-color: #4b97d2; padding: 5px; font-family: sans-serif; color: white; text-decoration: none;width:120px;">
                            <a style="font-family:sans-serif;color:white;text-decoration:none;" on-tap="_storeLinkedIn" href="https://www.google.nl/search?q=[[item.FirstName]]+[[item.LastName]]+intitle%3Alinkedin" target="_blank">Zoek profiel op <img style="vertical-align: text-bottom;margin-left: 5px;" src="/images/linkedin.svg"></a>
                            </div>
                        </template>
                    
                    </div>
                </div>
                <div>
                    <template is="dom-if" if="[[_hasDetails(item)]]">
                        <template is="dom-if" if="[[_isStudent(item.PersonaName)]]">
                            <div style="padding: 15px; width: 82vw; height: 55vh; overflow: scroll;  position: relative; left: 0px; margin: 10px;">
                            <template is="dom-if" if="[[item.Motivatie]]">
                                <span style="font-weight:normal;color:var(--tint-color);">Waarom ben ik op dit evenement?</span><br/>
                                <p style="margin:0px">[[item.Motivatie]]</p><br/>
                            </template>
                            </div>
                        </template>
                        <template is="dom-if" if="[[_isOndernemer(item.PersonaName)]]">
                            <div style="padding: 15px; width: 82vw; height: 55vh; overflow: scroll;  position: relative; left: 0px; margin: 10px;">
                            <span style="font-weight:normal;color:var(--tint-color);">Omschrijving [[item.CompanyName]]</span><br/>
                            <p style="margin:0px">[[item.Omschrijving]]</p><br/>
                            <span style="font-weight:normal;color:var(--tint-color);">Sectors</span><br/>
                            <div style="margin:0px;margin-top:10px;margin-bottom:15px;display:flex;flex-wrap:wrap;">
                            <template is="dom-repeat" items="[[_getSectors(item.Sectors)]]">
                                        <div style="font-size:10px;color:var(--text-primary-color);background-color:var(--tint-color);border-radius:5px;margin:2px;padding-left:5px;padding-right:5px;">{{item}}</div>
                            </template>
                            </div>
                            <!-- <span style="font-weight:normal;color:var(--tint-color);">Oprichtingsjaar</span><br/>
                            <p style="margin:0px">[[item.FoundingYear]]</p><br/>
                            <span style="font-weight:normal;color:var(--tint-color);">Business model</span><br/>
                            <p style="margin:0px">[[item.BusinessModel]]</p><br/>
                            <span style="font-weight:normal;color:var(--tint-color);">Werknemers</span><br/>
                            <p style="margin:0px">[[item.WerknemersAantal]]</p><br/> -->
                            <span style="font-weight:normal;color:var(--tint-color);">Ik zou graag mensen willen ontmoeten die mij toegang bieden tot</span><br/>
                            <div style="margin:0px;margin-top:10px;margin-bottom:15px;display:flex;flex-wrap:wrap;">
                            <template is="dom-repeat" items="[[_getSectors(item.Connect)]]">
                                        <div style="font-size:10px;color:var(--text-primary-color);background-color:var(--tint-color);border-radius:5px;margin:2px;padding-left:5px;padding-right:5px;">{{item}}</div>
                            </template>
                            </div>
                            <template is="dom-if" if="[[item.Interests]]">
                                <span style="font-weight:normal;color:var(--tint-color);">Waaraan ga ik deelnemen</span><br/>
                                <p style="margin:0px">[[item.Interests]]</p>
                            </template>
                            </div>
                        </template>
                        <template is="dom-if" if="[[_isBezoeker(item.PersonaName)]]">
                             <div style="padding: 15px; width: 82vw; height: 55vh; overflow: scroll;  position: relative; left: 0px; margin: 10px;">
                            <span style="font-weight:normal;color:var(--tint-color);">Omschrijving [[item.CompanyName]]</span><br/>
                            <p style="margin:0px">[[item.Omschrijving]]</p><br/>
                            <template is="dom-if" if="[[item.Functie]]">
                            <span style="font-weight:normal;color:var(--tint-color);">Functie</span><br/>
                            <p style="margin:0px">[[item.Functie]]</p><br/>
                            </template>
                             <template is="dom-if" if="[[item.Sector]]">
                                <span style="font-weight:normal;color:var(--tint-color);">Sectors</span><br/>
                                <div style="margin:0px;margin-top:10px;margin-bottom:15px;display:flex;flex-wrap:wrap;">
                                <template is="dom-repeat" items="[[_getSectors(item.Sector)]]">
                                            <div style="font-size:10px;color:var(--text-primary-color);background-color:var(--tint-color);border-radius:5px;margin:2px;padding-left:5px;padding-right:5px;">{{item}}</div>
                                </template>
                                </div>
                            </template>
                            <template is="dom-if" if="[[item.Activiteiten]]">
                                <span style="font-weight:normal;color:var(--tint-color);">Activiteiten</span><br/>
                                <p style="margin:0px">[[item.Activiteiten]]</p><br/>
                            </template>
                             <template is="dom-if" if="[[item.Samenwerking]]">
                                <span style="font-weight:normal;color:var(--tint-color);">Samenwerking</span><br/>
                                <p style="margin:0px">[[item.Samenwerking]]</p><br/>
                            </template>
                            </div>
                        </template>
                     </template>
                </div>
           
                <template is="dom-if" if="[[!_hasDetails(item)]]">
                <div style="font-family:sans-serif;font-size:5vw;width:60vw;height:50vh;display:flex;align-items:center;justify-content:center;"><div style="text-align:center;color: #ababab;">Er is geen extra informatie beschikbaar</div>
                </div>
                </template>
                <div style="display:flex;position:absolute;bottom:0px;height:54px;padding-top:10px;width:100%;border-top:1px solid #d8d5d5;background-color: white;">
                    <template is="dom-if" if="[[!user]]">
                        <span on-tap="_claimUser" class$="{{_canClaim(user)}}" style="padding:10px;left:10px;position:absolute;user-select: none;margin:10px;color:var(--tint-color)" dialog-dismiss>Dit ben ik..</span>
                    </template>
                    <span style="padding:10px;user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);" dialog-dismiss>Sluiten</span>
                </div>
            </div>
       </paper-dialog>
        `;

export class BadgeMoreInfo extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }
    static get properties(){
        return {
            item: { type:String, notify:true}
        }
    }

    _isPhoto(photo){
        return photo && photo != "" && photo != "n/a";
    
    }

    _hasDetails(item){
        if (this.nodetails) return undefined;
        let retval = this._toNullWhenEmpty(item.Sector) || this._toNullWhenEmpty(item.Motivatie) || this._toNullWhenEmpty(item.Omschrijving) || this._toNullWhenEmpty(item.Sectors) || this._toNullWhenEmpty(item.BusinessModel) || this._toNullWhenEmpty(item.Description) ||this._toNullWhenEmpty(item.Onderwijsinstelling) ||
        this._toNullWhenEmpty(item.Activiteiten) || this._toNullWhenEmpty(item.CompanyName) || this._toNullWhenEmpty(item.Functie) || this._toNullWhenEmpty(item.Samenwerking);
        this.nodetails = retval == undefined;
        return retval;
    }
    _toNullWhenEmpty(item){
        if (!item) return undefined;
        if (item.trim() == "") return undefined;
        return item;
    }

    _hasItem(user) {
        return user && user != "";
    }

    _storeLinkedIn(){
        let username = localStorage["username"];
        this.$.statistics.storeStatistic(
                { 
                    created:new Date().toString(),
                    type:'LinkedIn',
                    from:this.personaname,
                    to:this.item.PersonaName
        });
    }

    _isStudent(role){
        return role == "Student";
    }
    _isOndernemer(role){
    return role == "Ondernemer";
    }
    _isBezoeker(role){
        return role == "Bezoeker";
    }

    _getCompany(role){
        if (role == "Student") return this.item.Onderwijsinstelling;
        if (role == "Ondernemer") return this.item.CompanyName;
        if (role == "Bezoeker") return this.item.CompanyName;
    }

     _getSectors(sectors){
        return sectors ? sectors.split(",") : [];
    }

    open(item, user, register, personaname) {
        this.item = item;
        this.register = register;
        this.nodetails = undefined;
        this.user = user;
        this.personaname = personaname;
        this.$.dialog.open();
    }

    _getImage(Photo, CompanyLogo){
        if (CompanyLogo)
            if (CompanyLogo != "" && CompanyLogo != "n/a" && CompanyLogo.length > 0) return CompanyLogo;
        if (Photo)
            if (Photo != "" && Photo != "n/a" && Photo.length > 0) return Photo;
        return "/images/nophoto.jpg";
    }

    _canClaim(){
        return this.user != "" ? "hidden" : ""
    }

    _claimUser(){
       if (this.user != "") return;
       this.dispatchEvent(new CustomEvent('claim-user', { detail: { item: this.item }, bubbles:true, composed:true}));
      
   }

}


customElements.define('badge-moreinfo', BadgeMoreInfo);