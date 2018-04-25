import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
        <style is="custom-style" include="app-styles">
        :root {
            --custom-paper-input: {
                margin-bottom:1650px;
                margin:auto;
                width:50vw;
                font-size:4vw;
                background-color:var(--paper-input-bg);
                border-radius:5px;
                padding-left:5px;
                padding-right:5px;
                min-width: 100px;
            };
        }
        h1 { color:var(--tint-color);line-height:30px;font-size:5vw;}
        h2 { color:var(--tint-color);margin-bottom:100px;font-size:4vw;}
        p { font-size:4vw;}
        #dialog { display:flex;}
        </style>
        <paper-dialog style="background-color:#232323;top:0px;position:fixed;z-index:1;overflow:hidden;height:100vh;width:100vw;margin:0px;" id="dialog" style="margin:10px">
            <div style="background-color:white;position:relative;margin:0px;padding:0px;width:90%;height:300px;margin:5%;align-self:center;">
            
            <div>
                <div style="padding:15px">
                <h1>[[header]]</h1>
                <p>[[content]]</p>
                <paper-input id="input" label="[[label]]" value="{{value}}" autofocus></paper-input>
            </div>
            <div style=" position:absolute;bottom:0px;height: 64px; width: 100%;">
                <hr style="0.5px solid silver" />
                <template is="dom-if" if="[[value]]">
                <span on-tap="_close" style="user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);" dialog-dismiss>Zoeken</span>
                </template>
                 <template is="dom-if" if="[[!value]]">
                <span style="user-select: none; margin: 10px;right: 10px;position: absolute; color: #c3c3c3;">Zoeken</span>
                </template>

                <span on-tap="_cancel" style="user-select: none; margin: 10px;right: 80px;position: absolute; color: var(--tint-color);" dialog-dismiss>Annuleren</span>
            </div>
            </div>
       </paper-dialog>`;

export class BadgePrompt extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }
    static get properties(){
        return {
            value: { type:String, notify:true}
        }
    }


    open(header, content, label, initialvalue) {
        this.value = initialvalue;
        this.header = header;
        this.content = content;
        this.label = label;
        this.$.dialog.open();
        this.$.input.focus();
    }

    _close(){
        this.dispatchEvent(new CustomEvent('close', { detail: { value: this.value }, bubbles:true, composed:true}));
    }
    _cancel(){
        this.dispatchEvent(new CustomEvent('cancel', { bubbles:true, composed:true}));
    }
}


customElements.define('badge-prompt', BadgePrompt);