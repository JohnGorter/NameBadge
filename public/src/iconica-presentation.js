// @ts-check 
import '/node_modules/@polymer/polymer/polymer.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/iron-pages/iron-pages.js'
import '/node_modules/@iconica/iconicaelements/ico-grid.js'

const htmlTemplate = `
    <style is="custom-style" include="shared-style"> 
    video { 
    min-width: 100vw;
    min-height: 100vh;
    width: auto;
    height: auto;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%,-50%);
    }

    #details { 
        transition:bottom 0.45s ease-in-out;
        position:relative;
        bottom:0vh;
        background-color:var(--light-primary-color);
        display:flex;
        align-items:center;
        justify-content:center;
        position:relative;
        bottom:-85vh;
        height:30vh;
        } 

       #details.shown {  
        position:relative;
        bottom:-35vh;
        height:30vh;
        }


      .info_details { 
        width:50vw;
        height:200px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        }

      .info_username { 
        color:var(--text-primary-color);
        font-size:5vw;
      }

      .info_company { 
        color:var(--text-primary-color);
        font-size:16px;
        margin-top:12px;
        }

      .back_panel {
        position:absolute;
        left:20px;
      } 
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
            <div><img style="width:50vw;" src="{_{item.thumburl}_}" /></div>
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
