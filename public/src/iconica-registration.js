import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/paper-input/paper-input.js'

const template = `
    <style>
    :host { font-family: 'Roboto'; } 
    .done { opacity:0.5}
    div { color:white}
    div[step0] { width:100vw;height:25vh}
    div[step1] { width:100vw;height:35vh}
    #pitchtext { margin-left:20px; height:10vh;}
    .large { font-size:24px;}
    p { margin:8px;}
    #profile { background-image:url('/images/profile.jpg');background-size:100% 100%;width:100%;height:80vh;margin-bottom:20px;}
    paper-input[disabled] { margin-bottom:40px;}
    paper-input[focused] { border:2px solid #71d1a4;}
    paper-input { margin-bottom:65px;margin-left:20px;width:50vw;background-color:white;border-radius:5px;padding-left:5px;padding-right:5px;min-width:50vw;}
    paper-icon-button { border-radius:20px;margin-left:20px;margin-right:20px;background-color:none;color:white;border:0px solid black;}
    paper-button { border-radius:20px; padding:15px; padding-left:25px; padding-right:25px; text-transform: capitalize;margin-right:20px;background-color:#71d1a4;color:white;border:0px solid black;}
    #spacer { flex:1;}
    paper-button[disabled] { opacity:0.5}
    #toolbar { width:100vw;display:flex;justify-content:flex-end;align-items:center; }
    #toolbar paper-button { margin:20px;padding-left:20px;padding-right:20px;}
    #wizard { position:absolute;display:flex;bottom:-50vh;height:50vh;flex-wrap:wrap;align-items:flex-end;width:100vw;background-color:red;transition:bottom 0.2s ease-in-out, height 0.2s ease-in-out}
    #wizard[step="0"] { bottom:0vh;height:50vh;background-color:#0082c9;}
    #wizard[step="1"] { bottom:0vh;height:60vh;background-color:#0082c9;}
    #wizard[step="2"] { bottom:0vh;height:35vh;background-color:#0082c9;}
    #wizard[step="3"] { bottom:0vh;height:100vh;background-color:#0082c9;}
    #wizard[step="4"] { bottom:0vh;height:75vh;background-color:#0082c9;}
    #wizard.toolbar { bottom:65px;}
    </style>
    <ico-wizard id="wizard" progressbar progressbar-style="small" showfinish step="{{step}}" on-step-changed="_onStep" on-complete="_completeRegistration">
        <div step4>
            <ico-photoselect id="photoselect" video="{{video}}" thumbs="{{thumbs}}" selectedthumb="{{thumb}}"></ico-photoselect>
        </div>
        <div step3 on-close="_stopRecording" on-open="_startRecording">
            <ico-videorecorder id="recorder" video={{video}} thumbs="{{thumbs}}" on-recording-complete="_completeRecording"></ico-videorecorder>
        </div>
        <div step2>
            <div id="profile"></div>
            <div id="pitchtext">
                <p class="large">Persoonlijke pitch van 7 seconden</p>
                <p>Stel jezelf voor aan andere bezoekers van [evenement]</p>
            </div>
        </div>
        <div step0>
            <paper-input value="{{username}}" label="voornaam + achternaam"></paper-input>
        </div>
        <div step1>
            <paper-input value="{{username}}" class="done" disabled label="voornaam + achternaam"></paper-input>
            <paper-input value="{{company}}" label="bedrijfsnaam"></paper-input>
        </div>
        <div id="toolbar" slot="toolbar">
            <paper-icon-button id="previous" icon="arrow-back" previouspage>prev</paper-icon-button>
            <div id="spacer"></div>
            <paper-button id="next" nextpage>{{nextstep}}</paper-button>
        </div>
</ico-wizard>
`;

export class IcoRegistration extends PolymerElement {
    static get template(){ return template;}
    static get properties() { return { 
        step:{type:Number, notify:true},
        username:{type:String, notify:true},
        nextstep:{ type:String, value:"Start registratie", notify:true}
    }}

    start() { if (this._hasToolbar()) { this.$.wizard.classList.add("toolbar")}; import('./iconica-wizard.js');  }
    _stopRecording(e) { this.$.recorder.stop(); }
    _startRecording(e) { 
        this.nextstep = "Opslaan"; 
        this.$.next.disabled = true; 
        this.$.previous.disabled = true;
    }
    _completeRecording() {
        this.$.next.disabled = false; 
        this.$.previous.disabled = false;
    }
    _onStep(step){
        if(step.detail.value == 2) this.nextstep = "Start opname";
        if (step.detail.value == 3) import ("./iconica-videorecorder.js").then(() => this.$.recorder.init(true));
        if (step.detail.value == 4) import ("./iconica-photoselect.js").then(() => this.$.photoselect.selectPhoto());
    }
    _completeRegistration(){
        console.log("completed registration", { u:this.username, c:this.company, v:this.video, t:this.thumb});
    }
    _hasToolbar(){
        return window.outerHeight < (screen.height-24);
    }
}

customElements.define('ico-registration', IcoRegistration);

