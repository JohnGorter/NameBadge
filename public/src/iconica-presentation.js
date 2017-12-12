// @ts-check 
import '/node_modules/@polymer/polymer/polymer.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/iron-pages/iron-pages.js'
import '/node_modules/@iconica/iconicaelements/ico-grid.js'

const htmlTemplate = `
    <style>
    #grid { }
    paper-icon-button { border-radius:20px;margin-left:20px;margin-right:20px;background-color:none;color:white;border:0px solid black;}
        paper-button { border-radius:20px; padding-left:25px; padding-right:25px; text-transform: capitalize;margin-right:20px;background-color:#43BC84;color:white;border:0px solid black; height:70px; width: 200px;}
    #videopanel { position:absolute;display:flex;flex-direction:column;justify-content:space-around;height:90vh; width:100vw;top:0vh;background-color:black;}
    
    video { height:80%;width:100%}
    </style>
   
    <iron-pages id="pages" selected="1">
        <div id="videopanel">
           
            <video id="video" autoplay onended="_showBars"> 
            </video>
            <div id="details">
                <paper-icon-button icon="arrow-back" on-tap="_back"></paper-icon-button>
            </div>
        </div>
        <ico-grid id="grid" grid items="{{items}}" on-item-selected="_selectVideo">
            <div><img style="width:98vw;" src="{_{item.thumb}_}" /></div>
        </ico-grid>
    </iron-pages>
`;

export class IcoPresentation extends GestureEventListeners(Element) {
    static get template() { return htmlTemplate; }
    static get properties() {
        return {
            items: { type:Array, notify:true, value:[]},
            videourl: { type:String, value:''}
        }
    }

    connectedCallback(){
        document.addEventListener("click", () => {
            if (this.$.pages.selected == 0 && !this.$.video.paused)
                this.$.video.pause();
        });
    }
    detached() {
        console.log("detached!");
    }

    _back(){
        this.$.video.pause();
        this.$.pages.selected = 1;
    }

    _selectVideo(e){
        this.$.video.src = e.detail.videourl;
        this.$.video.play();
        this.$.pages.selected = 0;
    }
    _showBars(){
        this.$.toolbar.addClass("shown");
        this.$.bottombar.addClass("shown");
    }
}

customElements.define('ico-presentation', IcoPresentation);