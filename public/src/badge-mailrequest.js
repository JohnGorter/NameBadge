import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
        <style is="custom-style" include="app-styles">
        h1 { color:var(--tint-color);line-height:30px;}
        h2 { color:var(--tint-color);margin-bottom:100px;font-size:14px;}
        #dialog { display:flex;}
        </style>
        <paper-dialog style="background-color:#232323;top:0px;position:fixed;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
            <div style="background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:250px;margin:5%;align-self:center;">
            
            <div>
                <div style="padding:15px">
                <h1>[[header]]</h1>
                <p>Dank u voor uw verzoek om materiaal. Dit verzoek zal bij de spreker worden neergelegd. U zult na de bijeenkomst zo spoedig mogelijk het materiaal behorende bij [[event]] via de mail toegestuurd krijgen.</p>
                <p>Uw opgegeven email adres is [[email]]<p>
            </div>
            <div style=" position:absolute;bottom:0px;height: 64px; width: 100%;">
                <hr style="0.5px solid silver" />
                <span on-tap="_savereview" style="user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);" dialog-dismiss>Sluiten</span>
            </div>
            </div>
       </paper-dialog>`;

export class BadgeMailRequest extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }
    open(header, event, email, buttons) {
        this.header = header;
        this.event = event;
        this.email = email;
        this.$.dialog.open();
    }
}

customElements.define('badge-mailrequest', BadgeMailRequest);