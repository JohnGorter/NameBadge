import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';
import '/node_modules/@polymer/iron-selector/iron-selector.js';
import './badge-includes.js'

const htmlTemplate = `
    <div style="display:flex;flex-flow:column;align-content:center;justify-content:center">
        <iron-selector multi="[[multi]]" selected="{{selected}}" selected-items="{{selecteds}}">
        <slot></slot>
        </iron-selector>
    </div>
`;

export class BadgeButtonGroup extends PolymerElement {
    static get template() { return htmlTemplate;}

    static get properties() {
        return {
            selected:{type:Number, value:0, notify:true},
            selecteds:{type:Array, value:[], notify:true},
            multi:{type:Boolean, value:false, notify:true}
        }
    }
}

customElements.define('badge-buttongroup', BadgeButtonGroup); 
