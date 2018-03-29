import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const html = String.raw;

export class BadgeScanner extends PolymerElement {
    static get template() { return html`
        <style is="custom-style" include="app-styles">
            .scanner {
                font-size:16px;
                background-color:var(--general-background);position:absolute;top:0px;display:flex;flex-flow:column;height:100vh;width:100%;align-items:center;justify-content:center;
            }
        </style>
        
        <input type="file" accept="image/*" id="scaninput" on-change="_scanImage">
        <div class="scanner" on-tap="_scan"><div><h2>Wil je een connectie leggen?</h2></div><img src="/images/kaartje-sb.svg" height="180" style="margin-top: 10px;"></img><paper-button raised class="primary-button">Scan badge</paper-button></div>
    `; }

    connectedCallback(){
        super.connectedCallback(); 
        qrcode.callback = (decodedDATA) => {
            this.dispatchEvent(new CustomEvent('badge-scanned', { detail:decodedDATA, composed:true, bubbles:true }));
        };
    }
    _scan(){
        this.$.scaninput.value = "";
        this.$.scaninput.click();
    }
    _scanImage(e){
        if (e.target.files.length > 0) {
            var file = e.target.files[0];
	        var reader = new FileReader();
            reader.onload = function(e) {
                qrcode.decode(e.target.result);
            };
            // Read in the image file as a data URL.
            reader.readAsDataURL(file);	
        }
    }
}

customElements.define('badge-scanner', BadgeScanner);