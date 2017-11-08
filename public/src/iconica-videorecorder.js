import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/paper-button/paper-button.js'

var template = `
<style>
    paper-progress { --paper-progress-height: 40px; --paper-progress-secondary-color:var(--paper-green-100);--paper-progress-active-color:var(--paper-green-500);}
    #container { background-color:black;position:absolute;left:0px;top:0px;height:100vh;width:100vw;}
    video { left:0pc;z-index:0;height:80vh;width:100vw;}
    #counter { position:absolute;z-Index:10;font-size:128px;color:white;left:40vw;top:30vh;}
    #progressbar { top:58px;width:100vw;}
    </style>
    <div id="container"> 
       <paper-progress id="progressbar" style="visibility:hidden" value="7" max="7" min="0" secondary-progress="7"></paper-progress>
        <span id="counter">{{counter}}</span>
        <video id="video" hidden></video>
        <video id="preview" autoplay playsinline muted></video>
        <canvas id="canvas" hidden></canvas>
    </div>
`;

export class IconicaVideoRecorder extends PolymerElement {
    static get template()   { return template; }
    static get properties() {
        return {
            video: { type:Object, notify:true },
            counter: { type:Number, value:3},
            duration: { type:String, value:''},
            thumbs: { type:Array, value:[], notify:true}
        };
    }

    init(autostart){
        this.$.counter.hidden = true;
        var hdConstraints = { audio:true,  video: true };
        this.$.video.src = '';
        this.$.video.hidden = true;
        navigator.mediaDevices.getUserMedia(hdConstraints).then((stream)=>{
            this.stream = stream;
            this.$.preview.srcObject = stream;
            this.$.preview.play(); 
            if (autostart) this.start();
        });
    }

    stop(){
        this.playing = false;
        this.stream.stop();
        this.$.counter.hidden = true;
        this.$.video.src = '';
        this.$.video.hidden = true;
        this.$.progressbar.style.visibility = 'hidden';
        this.dispatchEvent(new CustomEvent('stop', {}));
    }

    save(){
        this.playing = false;
        this.stream.stop();
        this.dispatchEvent(new CustomEvent('save', { detail:{data:this.video, thumb:this.thumb}}));
    }

    start(){
        this.$.counter.hidden = false;
        this.$.video.hidden = true;
        this.set('counter', 3);
        var i = setInterval(()=>{
            this.counter = this.counter - 1;
            if (this.counter == 0) {
                this.$.counter.hidden = true;
                this.startRecording();
                clearInterval(i);
            } 
        }, 1000);
    }

    startRecording(){
        var timer = 7;
        this.starttime = Date.now();
        this.duration = "00:00";
        this.$.progressbar.style.visibility = 'visible';
        this.playing = true;
        this.completed = false;
        var mediaRecorder = new MediaStreamRecorder(this.stream);
        this.$.canvas.width = this.$.preview.videoWidth;
        this.$.canvas.height = this.$.preview.videoHeight;
        mediaRecorder.stream = this.stream;
        this.interval = setInterval(()=>{
            var seconds = Date.now() - this.starttime;
            this.duration = "00:0" + Math.round(seconds / 1000);
            if (this.thumbs.length < 3){
                this.$.canvas.getContext("2d").drawImage(this.$.preview, 0, 0);
                this.thumbs.push(this.$.canvas.toDataURL("image/png"));
            }
            this.$.progressbar.value = timer--;
        }, 1000);

        mediaRecorder.ondataavailable = (blob) => {
            if (!this.completed){
                clearInterval(this.interval);
                this.video = window.URL.createObjectURL(blob);
                this.$.video.src = this.video;
                //this.$.video.controls = true;
                this.$.video.hidden = false;
                this.$.preview.hidden = true;
                mediaRecorder.stop(); 
                this.completed = true;
                this.dispatchEvent(new CustomEvent("recording-complete"));
                this.playing = false;
                this.duration = "";
            }
        }
        mediaRecorder.start(8 * 1000);
    }
}

customElements.define('ico-videorecorder', IconicaVideoRecorder);