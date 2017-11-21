// @ts-check 

import '/node_modules/@polymer/polymer/polymer.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'

import '/node_modules/@iconica/iconicaelements/ico-grid.js'

const htmlTemplate = `
    <style>
    #grid { z-index:10;position:absolute;width:100vw;height:90vh;top:10vh;position:absolute;background-color:#0082c9;overflow:scroll;}
    </style>
    <ico-grid id="grid" grid items="{{items}}" on-item-selected="_selectVideo">
        <div><img height="100%" width="100%" src="{_{item.thumb}_}" /></div>
    </ico-grid>
`;

export class IcoPresentation extends Element {
    static get template() { return htmlTemplate; }
    static get properties() {
        return {
            items: { type:Array, notify:true, value:[]}
        }
    }
}

customElements.define('ico-presentation', IcoPresentation);