import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
        <style is="custom-style" include="app-styles">
        h1 { color:var(--tint-color);line-height:30px;}
        h2 { color:var(--tint-color);margin-bottom:100px;font-size:14px;}
        </style>
        <paper-dialog style="background-color:#232323;top:0px;position:fixed;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
            <div style="background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:90%;margin:5%">
            
            <div>
                <div style="padding:15px">
                <h1>[[header]]</h1>
                <p>Laat hier uw waardering voor de presentatie achter door op de ster te selecteren die uw oordeel vertegenwoordigd. Hoe meer sterren, hoe hoger de waardering.</p>
                <h2>"[[event]]"</h2>
                <badge-rating labels rating="{{rating}}"></badge-rating>
            </div>
            <div style=" position:absolute;bottom:0px;height: 64px; width: 100%;">
                <hr style="0.5px solid silver" />
                <span on-tap="_cancel"  style="user-select: none; margin: 10px;right: 100px;position: absolute; color: var(--tint-color);" dialog-dismiss>[[canceltext]]</span>
                <span on-tap="_close" style="user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);" dialog-dismiss>[[savetext]]</span>
            </div>
            </div>
       </paper-dialog>`;

export class BadgeReview extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }
    open(header, event, buttons) {
        this.rating = 0;
        this.header = header;
        this.canceltext = buttons ? buttons[0] : "Annuleren";
        this.savetext = buttons ? buttons[1] : "Opslaan";
        this.event = event;
        this.$.dialog.open();
    }


    _cancel(){
        this.dispatchEvent(new CustomEvent("cancel", { bubbles:true, composed:true}));
    }

    _close(){
        this.dispatchEvent(new CustomEvent('close', { detail: { rating:this.rating, event:this.event }, bubbles:true, composed:true }));
    }
}

customElements.define('badge-review', BadgeReview);