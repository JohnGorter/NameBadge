import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
    <style>
        .heading { font-size:6vw;}
    </style>
    <paper-dialog style="background-color:#232323;top:0px;padding-top:40px;position:fixed;z-index:999;overflow:hidden;height:100%;width:100%;margin:0px;" id="dialog" style="margin:10px">
        <div style="display:flex;flex-flow:column;">
        <div style$="[[_getPhoto(item.Photo)]]" 
        background:url([[_getPhoto(item.Photo)]]);background-size:100% 100%;">
        <template is="dom-if" if="[[!item.Photo]]">
            <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%">
                <span style="text-align:center;color:white;text-shadow:5px 5px 5px #000;">No Photo Available</span>
            </div>
        </template>
        <template is="dom-if" if="[[_currentUser(item)]]">
            <div style="position:absolute;top:0px;line-height:30px;">
                <iron-icon style="margin:5px;color:yellow;width:30px;height:30px;justify-self:flex-end;" icon="verified-user"></iron-icon><span style="color:yellow;font-size:12px;">Verified user</span>
            </div>
        </template>
        <span style="text-shadow: 5px 5px 5px #222;line-height:1;position:absolute;padding-left:10px;bottom:10px;color:white;font-size:10vw;">[[item.Username]]
        </div>
        <div style="position:relative;padding:15px;background-color: white; height:140px;">
            <div>
               
                <template is="dom-if" if="[[!_hasDetails(item)]]">
                    <h1 class="heading" style="color:var(--tint-color)">Helaas!</h1>
                    <p>Jammer genoeg heeft [[item.Username]] niet meer informatie vrijgegeven voor dit evenement.</p>
                </template>
                <template is="dom-if" if="[[_hasDetails(item)]]">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <h1 class="heading" style="display:inline;color:var(--tint-color)">[[item.CompanyName]]</h1>
                <span class="title" style="color:var(--tint-color);margin:0px">[[item.PersonaName]]</span>
                </div>
                <template is="dom-if" if="[[item.Sector]]">
                <p class="title" style="color:var(--tint-color);margin:0px">Sector</p>
                <div style="margin:0px;margin-top:10px;display:flex;flex-wrap:wrap;">
                        <template is="dom-repeat" items="[[_getSectors(item.Sector)]]">
                            <div style="font-size:10px;color:var(--text-primary-color);background-color:var(--tint-color);border-radius:5px;margin:2px;padding-left:5px;padding-right:5px;">{{item}}</div>
                        </template>
                </div>
                </template>
                </template>
            </div>
        </div>
        <div class="buttons" style="display:flex;height:54px;align-items:center;justify-content:flex-end;position:relative;border-top:1px solid #d8d5d5;background-color: white;">
            <template is="dom-if" if="[[_hasDetails(item)]]">
                <span style="user-select: none;margin:10px;margin-right:20px;color:var(--tint-color)" on-tap="_close" dialog-confirm>
                <template is="dom-if" if="{{unlock}}">
                    <iron-icon style="height:12px;width:12px;" icon="lock"></iron-icon>
                </template>
                Meer informatie</span>
            </template>
            <span style="user-select: none;margin:10px;margin-right:20px;color:var(--tint-color)" on-tap="_cancel" dialog-dismiss>Sluiten</span>
        </div>
        </div>
    </paper-dialog>
        `;

export class BadgeBasicInfo extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }
    static get properties(){
        return {
            item: { type:String, notify:true},
            unlock: { type:Boolean, notify:true}
        }
    }


    open(item, unlock) {
        this.nodetails = undefined;
        this.item = item;
        this.unlock = unlock;
        this.$.dialog.open();
    }

     _currentUser(item){
        let user = localStorage["user"];
        return  user == item.Email;
    }

     _getPhoto(img) {
        if (img && img != "n/a") 
            return `position:relative;top:10px;margin:0px;padding:0px;height:40vh;background:url(${img}) no-repeat;background-size:100% 100%;`;
        else {
            let retval =  `position:relative;margin:0px;padding:0px;height:40vh;`;
            retval += ("background-color:" + ["#43BC84", "#08A195","#0DC4D7"][(Math.floor(Math.random() * 10) % 3)]);
            return retval;
        }
        
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

    _getSectors(sectors){
        return sectors ? sectors.split(",") : [];
    }

    _close(){
        this.dispatchEvent(new CustomEvent('close', { detail: { item: this.item, confirmed:true }, bubbles:true, composed:true}));
    }
    _cancel(){
        this.dispatchEvent(new CustomEvent('cancel', { bubbles:true, composed:true}));
    }
}


customElements.define('badge-basicinfo', BadgeBasicInfo);