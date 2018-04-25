import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const html = String.raw;
const htmlTemplate = html`
        <style>
        .flipcontainer {perspective:1000px}
        .flipcontainer.hover .flipper{
            transform: rotateY(180deg);
        }
        .flipcontainer, .front, .back {
            height:100vh;width:100vw;
        }
        .flipper {
            transition:0.6s;
            transform-style:preserve-3d;
            position:relative;
        }
        .front, .back {
            background-color:white;
            backface-visibility:hidden;
            position:fixed;
            top:0px;left:0px;
        }
        .front {
            z-index:300;
            transform:rotateY(0deg);
        }
        .back {
            z-index:200;
            transform:rotateY(180deg);
        }
        </style>
        <div class="flipcontainer" id="flip">
             <div class="flipper">
                <div class="front"><slot name="front"></slot></div>
                <div class="back"><slot name="back"></slot></div>
            </div>
        </div>`;

export class BadgeFlipper extends PolymerElement {
    static get template(){
        return htmlTemplate;
    }

    flip(){
        this.$.flip.classList.toggle("hover");
    }
}

customElements.define("badge-flipper", BadgeFlipper);