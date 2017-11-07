import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'

const template = `
    <style>
        video { width:100vw;}
        .container {position:relative; display: grid;height:47vh; margin-bottom:20px; grid-template-columns: 66% 33%; grid-template-rows: auto; grid-template-areas: "main second"  "main third";
        }
        .item-b { grid-area: main; padding:2px; }
        .item-c { grid-area: second; padding:2px; }
        .item-d { grid-area: third; }
        .item   { padding:2px; }
        .item[focus] { z-index:10; outline: 5px solid #71d1a4; bordser: thick solid green;background-color:#71d1a4;}
        canvas { width:100%;height:100%;}
    </style>
    <div class="container">
        <div class="item item-b" focus$="{{_focus(1, selected)}}" on-tap="_select"><canvas id="canvas1"></canvas></div>
        <div class="item item-c" focus$="{{_focus(2, selected)}}" on-tap="_select"><canvas id="canvas2"></canvas></div>
        <div class="item item-d" focus$="{{_focus(3, selected)}}" on-tap="_select"><canvas id="canvas3"></canvas></div>
    </div>
    <video id="video" hidden muted autoplay><source src="" /></video>
`;
export class IconicaPhotoSelect extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    static get properties() { return { 
        video : { type:Object, value:{}, observer:'_videoChanged'},
        thumb : { type:Object, value:{}, notify:true},
    }}

    _videoChanged(){
        // draw the video on the canvas and take random frames..
        if (this._isEmpty(this.video)) return;
        this.$.video.src = this.video;
        this.counter = 0 ;
        this.interval = setInterval(() => {
            var canvasses = [this.$.canvas1, this.$.canvas2, this.$.canvas3];
            var canvas = canvasses[this.counter % 3];
            canvas.getContext("2d").drawImage(this.$.video, 0, 0, this.$.video.videoWidth, this.$.video.videoHeight, 0, 0, canvas.width, canvas.height);
            if (this.counter++ == 3) { this.counter = 0; clearInterval(this.interval);}
        }, 1000); 

    }

    _select(e){  
        this.selected = e.target == this.$.canvas1 ? 1 : e.target == this.$.canvas2 ? 2 : 3; 
        this.thumb = e.target.toDataURL("image/png");  
    }
    _focus(sel, selected){  return sel == selected; }
    _isEmpty(obj){  return obj == undefined || Object.keys(obj).length === 0 && obj.constructor === Object; }

    constructor(){
        super();
        this.selected = 1;
        window.addEventListener("keydown", (e) => {
            if (e.key == "ArrowDown")  this.selectNext('down');
            if (e.key == "ArrowLeft")  this.selectNext('left');
            if (e.key == "ArrowRight") this.selectNext('right');
            if (e.key == "ArrowUp")    this.selectNext('up');
        });
    }

    init(video){  this.video = video; }
    selectNext(dir){
        if (dir == "right" && this.selected == 1) this.selected = this.previous || 2;
        if (dir == "left" && (this.selected == 2 || this.selected == 3)) { this.previous = this.selected; this.selected = 1; }
        if (dir == "up" && this.selected == 3) this.selected = 2;
        if (dir == "down" && this.selected == 2) this.selected = 3;
    }
}

customElements.define('ico-photoselect', IconicaPhotoSelect);