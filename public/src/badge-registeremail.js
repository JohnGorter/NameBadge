import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
        <style is="custom-style">
        h1 { color:var(--tint-color);line-height:30px;}
        h2 { color:var(--tint-color);margin-bottom:100px;font-size:14px;}
        #dialog { display:flex;}
        </style>
        <paper-dialog style="background-color:#232323;top:0px;position:fixed;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
            <div style="background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:400px;margin:5%;align-self:center;">
            
            <div>
                <div style="padding:15px">
                <h1>Wat is uw emailadres</h1>
                <p>Om een verzoek tot materiaal te doen, hebben wij uw email adres nodig. Geef hieronder uw email adres op indien u wenst 
                    het verzoek te voltooien.
                </p>
                <paper-input label="email" value="{{email}}">
                    <iron-icon icon="mail" slot="prefix" style="margin-right:20px;"></iron-icon>
                </paper-input>
            </div>
            <div style=" position:absolute;bottom:0px;height: 64px; width: 100%;">
                <hr style="0.5px solid silver" />
                <span on-tap="_close" style="user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);" dialog-dismiss>Versturen</span>
                <span on-tap="_cancel" style="user-select: none; margin: 10px;right: 80px;position: absolute; color: var(--tint-color);" dialog-dismiss>Annuleren</span>
            </div>
            </div>
       </paper-dialog>`;

export class BadgeRegisterEmail extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }

    static get properties() {
        return {
            email: { type:String, notify:true }
        }
    }
    open(header) {
        this.header = header;
        this.$.dialog.open();
    }

    _close(){
        localStorage["emailaddress"] = this.emailaddress;
        this.dispatchEvent(new CustomEvent('close', { bubbles:true, composed:true}));
    }
    _cancel(){
        this.dispatchEvent(new CustomEvent('cancel', { bubbles:true, composed:true}));
    }
}

customElements.define('badge-registeremail', BadgeRegisterEmail);