import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
     <paper-dialog style="z-index:60;background-color:#232323;top:0px;position:absolute;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
            <div style="background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:95%;margin:5%">
            <div style="display:flex;position:relative;width:100%;height:130px;background-color:white;">
                <div style="margin:25px;border-radius:50%;width:100px;height:100px; background:url('[[_getImage(item.Photo,item.CompanyLogo)]]');background-size:100% 100%"></div>
                <div>
                    <h1 style="color:var(--tint-color);font-size:20px;margin-top: 25px;margin-bottom: -8px;">[[item.Username]]</h1>
                    <h2 style="color:var(--tint-color);font-size:16px;;margin-bottom: 5px;">[[item.Company]]</h2>
                    <p style="margin:0px;"><iron-icon style="margin-right:10px;" icon="communication:email"></iron-icon><a href="mailto:[[moreinfoItem.Email]]">[[item.Email]]</a></p>
                    <p style="margin:0px;"><iron-icon style="margin-right:10px;" icon="communication:phone"></iron-icon><a href="tel:[[moreinfoItem.Telefoonnummer]]">[[item.Telefoonnummer]]</a></p>
                </div>
            </div>
            <div>
                <div style="padding:15px">
                <span style="color:var(--tint-color);">[[item.Company]] Omschrijving</span><br/>
                <p style="margin:0px">[[item.Omschrijving]]</p><br/>
                <span style="color:var(--tint-color);">Sector</span><br/>
                <p style="margin:0px">[[item.Sector]]</p><br/>
                <span style="color:var(--tint-color);">Business model</span><br/>
                <p style="margin:0px">[[item.BusinessModel]]</p><br/>
                <span style="color:var(--tint-color);">Ik zou graag mensen willen ontmoeten die mij toegang bieden tot</span><br/>
                <p style="margin:0px">[[item.Motivation]]</p><br/>
                <span style="color:var(--tint-color);">Waaraan ga ik deelnemen</span><br/>
                <p style="margin:0px">[[item.Interests]]</p>
               
                </div>
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


    open(item, emailaddress) {
        this.item = item;
        this.emailaddress = emailaddress;
        this.$.dialog.open();
    }

    _getImage(Photo, CompanyLogo){
        if (CompanyLogo != "n/a" && CompanyLogo.length > 0) return CompanyLogo;
        if (Photo != "n/a" && Photo.length > 0) return Photo;
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