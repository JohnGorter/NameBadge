import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
     <paper-dialog style="z-index:60;background-color:#232323;top:0px;position:fixed;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
            <div style="background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:95%;margin:5%">
            <div style="display:flex;position:relative;width:100%;height:130px;background-color:white;">
                <div style="margin:25px;border-radius:50%;width:100px;height:100px; background:url('[[_getImage(item.Photo,item.CompanyLogo)]]');background-size:100% 100%"></div>
                <div>
                    <h1 style="color:var(--tint-color);font-size:4vw;margin-top: 25px;margin-bottom: -8px;">[[item.Username]]</h1>
                    <h2 style="color:var(--tint-color);font-size:3vw;margin-bottom: 5px;">[[_getCompany(item.PersonaName)]]</h2>
                    <div style="margin-top:15px;display:flex;border-radius: 5px; background-color: #4b97d2; padding: 5px; font-family: sans-serif; color: white; text-decoration: none;width:120px;">
                    <a style="font-family:sans-serif;color:white;text-decoration:none;" href="https://www.google.nl/search?q=[[item.FirstName]]+[[item.LastName]]+intitle%3Alinkedin" target="_blank">Zoek profiel op <img style="vertical-align: text-bottom;margin-left: 5px;" src="/images/linkedin.svg"></a>
                    </div>
                   
                </div>
            </div>
            <div>
            <template is="dom-if" if="[[_isStudent(item.PersonaName)]]">
                <div style="padding:15px">
                <span style="font-weight:bold;color:var(--tint-color);">Waarom ben ik op dit evenement?</span><br/>
                <p style="margin:0px">[[item.Motivatie]]</p><br/>
                </div>
            </template>
            <template is="dom-if" if="[[_isOndernemer(item.PersonaName)]]">
                <div style="padding:15px">
                <span style="font-weight:bold;color:var(--tint-color);">Omschrijving [[item.CompanyName]]</span><br/>
                <p style="margin:0px">[[item.Omschrijving]]</p><br/>
                <span style="font-weight:bold;color:var(--tint-color);">Sectors</span><br/>
                <div style="margin:0px;margin-top:10px;display:flex;flex-wrap:wrap;">
                <template is="dom-repeat" items="[[_getSectors(item.Sectors)]]">
                            <div style="font-size:10px;color:var(--text-primary-color);background-color:var(--tint-color);border-radius:5px;margin:2px;padding-left:5px;padding-right:5px;">{{item}}</div>
                </template>
                </div>
                <span style="font-weight:bold;color:var(--tint-color);">Oprichtingsjaar</span><br/>
                <p style="margin:0px">[[item.FoundingYear]]</p><br/>
                <span style="font-weight:bold;color:var(--tint-color);">Business model</span><br/>
                <p style="margin:0px">[[item.BusinessModel]]</p><br/>
                <span style="font-weight:bold;color:var(--tint-color);">Werknemers</span><br/>
                <p style="margin:0px">[[item.WerknemersAantal]]</p><br/>
                <span style="font-weight:bold;color:var(--tint-color);">Ik zou graag mensen willen ontmoeten die mij toegang bieden tot</span><br/>
                 <div style="margin:0px;margin-top:10px;display:flex;flex-wrap:wrap;">
                <template is="dom-repeat" items="[[_getSectors(item.Connect)]]">
                            <div style="font-size:10px;color:var(--text-primary-color);background-color:var(--tint-color);border-radius:5px;margin:2px;padding-left:5px;padding-right:5px;">{{item}}</div>
                </template>
                </div>
                <span style="font-weight:bold;color:var(--tint-color);">Waaraan ga ik deelnemen</span><br/>
                <p style="margin:0px">[[item.Interests]]</p>
                </div>
            </template>
            <template is="dom-if" if="[[_isBezoeker(item.PersonaName)]]">
               <div style="padding:15px">
                <span style="font-weight:bold;color:var(--tint-color);">Omschrijving [[item.CompanyName]]</span><br/>
                <p style="margin:0px">[[item.Omschrijving]]</p><br/>
                <span style="font-weight:bold;color:var(--tint-color);">Functie</span><br/>
                <p style="margin:0px">[[item.Functie]]</p><br/>
                <span style="font-weight:bold;color:var(--tint-color);">Sector</span><br/>
                <p style="margin:0px">[[item.Sector]]</p><br/>
                 <span style="font-weight:bold;color:var(--tint-color);">Activiteiten</span><br/>
                <p style="margin:0px">[[item.Activiteiten]]</p><br/>
                <span style="font-weight:bold;color:var(--tint-color);">Samenwerking</span><br/>
                <p style="margin:0px">[[item.Samenwerking]]</p><br/>
                </div>
            </template>
            </div>
            <div style="display:flex;position:absolute;bottom:0px;height:54px;padding-top:10px;width:100%;border-top:1px solid #d8d5d5;background-color: white;">
                <template is="dom-if" if="[[!emailaddress]]">
                    <span on-tap="_claimUser" class$="{{_canClaim(emailaddress)}}" style="left:10px;position:absolute;user-select: none;margin:10px;color:var(--tint-color)" dialog-dismiss>Dit ben ik..</span>
                </template>
                <span style="user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);" dialog-dismiss>Sluiten</span>
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

    open(item, emailaddress) {
        this.item = item;
        this.emailaddress = emailaddress;
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
        return this.emailaddress != "" ? "hidden" : ""
    }

    _claimUser(){
       if (this.emailaddress != "") return;
       //console.log('claimed', this.moreinfoItem.email);
       this.dispatchEvent(new CustomEvent('claim-user', { detail: { item: this.item }, bubbles:true, composed:true}));
      
   }

}


customElements.define('badge-moreinfo', BadgeMoreInfo);