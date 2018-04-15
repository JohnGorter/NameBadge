import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
    <paper-dialog style="background-color:#232323;top:0px;position:absolute;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
        <div style="display:flex;flex-flow:column">
        <div style$="[[_getPhoto(item.Photo)]]" 
        background:url([[_getPhoto(item.Photo)]]);background-size:100% 100%;">
        <span style="text-shadow: 5px 5px 5px #222;line-height:1;position:absolute;padding-left:10px;bottom:10px;color:white;font-size:10vw;">[[item.Username]]
        </div>
        <div style="position:relative;padding:15px;background-color: white;  height:100px;">
            <div>
                <h1 class="heading" style="color:var(--tint-color)">[[item.Company]]</h1>
                <p class="title" style="color:var(--tint-color);margin:0px">Sector</p>
                <p style="margin:0px">[[item.Sector]]</p>
            </div>
        </div>
        <div class="buttons" style="display:flex;height:54px;align-items:center;justify-content:flex-end;position:relative;border-top:1px solid #d8d5d5;background-color: white;">
            <span style="user-select: none;margin:10px;margin-right:20px;color:var(--tint-color)" on-tap="_close" dialog-confirm>
            <template is="dom-if" if="{{unlock}}">
                <iron-icon style="height:12px;width:12px;" icon="lock"></iron-icon>
            </template>
             Meer informatie</span>
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
        this.item = item;
        this.unlock = unlock;
        this.$.dialog.open();
    }

     _getPhoto(img) {
        if (img && img != "n/a") 
            return `position:relative;top:10px;margin:0px;padding:0px;height:400px;background:url(${img}) no-repeat;background-size:100% 100%;`;
        else
            return `position:relative;margin:0px;padding:0px;height:60vh;background:url(/images/nophoto.jpg) no-repeat;background-size:100% 100%;`;
        
    }

    _close(){
        this.dispatchEvent(new CustomEvent('close', { detail: { item: this.item, confirmed:true }, bubbles:true, composed:true}));
    }
    _cancel(){
        this.dispatchEvent(new CustomEvent('cancel', { bubbles:true, composed:true}));
    }
}


customElements.define('badge-basicinfo', BadgeBasicInfo);