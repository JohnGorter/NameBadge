// @ts-check 
import '/node_modules/@polymer/polymer/polymer.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/iron-pages/iron-pages.js'
import '/node_modules/@iconica/iconicaelements/ico-grid.js'

const htmlTemplate = `
    <style>
    #grid { overflow:scroll }
    paper-icon-button { border-radius:20px;margin-left:20px;margin-right:20px;background-color:none;color:white;border:0px solid black;}
        paper-button { border-radius:20px; padding-left:25px; padding-right:25px; text-transform: capitalize;margin-right:20px;background-color:#43BC84;color:white;border:0px solid black; height:70px; width: 200px;}
    #videopanel { position:absolute;display:flex;flex-direction:column;justify-content:space-around;height:90vh; width:100vw;top:0vh;background-color:black;}
    #details { transition:bottom 0.45s ease-in-out;position:relative;bottom:-30vh;height:30vh;background-color:#0082c9;display:flex;align-items:center;justify-content:center;}
    #details.shown {  position:relative;bottom:0vh;height:30vh;background-color:#0082c9;display:flex;align-items:center;justify-content:center;}
    .info_details { width:50vw;height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;}
    .info_username { color:white;font-size:5vw;}
    .info_company { color:white;font-size:16px;margin-top:12px;}
    .back_panel { position:absolute;left:20px;}
    video { height:80%;width:100%}
    </style>
   
    <iron-pages id="pages" selected="1">
        <div id="videopanel">
            <video id="video" autoplay on-ended="_showBars"> 
            </video>
            <div id="details">
                <div class="back_panel">
                    <paper-icon-button icon="arrow-back" on-tap="_back"></paper-icon-button>
                </div>
                <div class="info_details">
                    <div class="info_username">{{ username }} </div>
                    <div class="info_company">{{ company }} </div>
                </div>
            </div>
        </div>
        <ico-grid id="grid" grid items="{{items}}" on-item-selected="_selectVideo">
            <div><img style="width:98vw;" src="{_{item.thumburl}_}" /></div>
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
        // document.addEventListener("click", () => {
        //     if (this.$.pages.selected == 0 && !this.$.video.paused)
        //         this.$.video.pause();
        // });
    }
    detached() {
        console.log("detached!");
    }

    _back(){
        this.$.video.pause();
        this.$.pages.selected = 1;
        this.style.overflow = 'scroll';
        this.$.details.classList.remove("shown");
        this.scrollTop = this.oldPos;
    }

    _selectVideo(e){
        this.oldPos = this.scrollTop;
        this.scrollTop = '0px';
        this.style.overflow = 'hidden';
        this.$.video.src = e.detail.videourl;
        this.username = e.detail.username;
        this.company = e.detail.company;
        var isPlaying = this.$.video.currentTime > 0 && !this.$.video.paused && !this.$.video.ended 
        && this.$.video.readyState > 2;
        if (!isPlaying) {
            this.$.video.play();
        }
        this.$.pages.selected = 0;
    }

    _showBars(){
        console.log('ended');
        this.$.details.classList.add("shown");
    }
}

customElements.define('ico-presentation', IcoPresentation);
