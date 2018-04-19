import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const htmlTemplate = `
    <style>
        paper-button[small] {
            width: 120px;
            height: 50px;
            background-color:#ddd;
            margin-bottom:10px;
            font-size: 2vw;
        }
        paper-button.iron-selected {
        transform:translateX(-1px) translateY(-1px);
        background-color:var(--tint-color);
        color:white;
        box-shadow:5px 5px 5px #555;
        }
        paper-fab {width:50px;height:50px;position:fixed;right:10px;bottom:50px;}
        .flyout { border:0px solid red; will-change: transform, opacity;transform:all;overflow:hidden;transition:all 0.2s ease-in-out;display:flex;align-content:center;justify-content:center;flex-flow:column;background-color:transparent;border-radius:5px;position:absolute;    right: 10px;  bottom: 75px; height: 400px; width: 130px;opacity:1}
        .flyout.collapsed { display:flex;align-content:center;justify-content:center;flex-flow:column;background-color:transparent;border-radius:5px;position:absolute;right:10px;height:0px;width:130px;opacity:0;}
    </style>
    <template is="dom-if" if="{{show}}">
        <div class="flyout">
        <badge-buttongroup>
            <paper-button on-tap="_apply" data-args="1" small>a - d</paper-button>
            <paper-button on-tap="_apply" small data-args="2">e - h</paper-button>
            <paper-button on-tap="_apply" small data-args="3">i - l</paper-button>
            <paper-button on-tap="_apply" small data-args="4">m - p</paper-button>
            <paper-button on-tap="_apply" small data-args="5">q - t</paper-button>
            <paper-button on-tap="_apply" small data-args="6">u - z</paper-button>
        </badge-buttongroup>
       </div>
       <paper-fab on-tap="_collapse" icon="filter-list"></paper-fab>
    </template>
    `;

export class BadgeFilter extends PolymerElement {
    static get template() { return htmlTemplate; }
    static get properties() {
        return {
            filter: { type:String, value:"", notify:true},
            show: { type:Boolean, value:true}
        }
    }

    connectedCallback() {
        super.connectedCallback();
        setTimeout(() => {
            this.shadowRoot.querySelector(".flyout").classList.add("collapsed")
        }, 1500);
    }
    _collapse(){
        this.shadowRoot.querySelector(".flyout").classList.contains("collapsed") ?
        this.shadowRoot.querySelector(".flyout").classList.remove("collapsed"): 
        this.shadowRoot.querySelector(".flyout").classList.add("collapsed");
    }
    _apply(e){
        switch(e.target.dataset.args){
            case '1': { this.filter = '["a", "b", "c", "d"]'; break;}
            case '2': { this.filter = '["e","f", "g", "h"]'; break;}
            case '3': { this.filter = '["i", "j", "k", "l"]'; break;}
            case '4': { this.filter = '["m", "n", "o", "p"]'; break;}
            case '5': { this.filter = '["q", "r", "s", "t"]'; break;}
            case '6' : { this.filter = '["u", "v", "w", "x", "y", "z"]'; break;}
        }
        this.shadowRoot.querySelector(".flyout").classList.add("collapsed")
    }
}

customElements.define('badge-filter', BadgeFilter); 


