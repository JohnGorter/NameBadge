// @ts-check

import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/paper-input/paper-input.js'

const template = `
    <style>
    :host { font-family: 'Roboto'; } 
      :root {
        --paper-input-container:{padding:12px 0;}
        --paper-input-container-underline: { display: none;}
        --paper-input-container-underline-focus: { display: none;}
        --paper-input-container-underline-disabled: {display: none;}
    }
    .done { opacity:0.5}
    div { color:white;background-color:#0082c9;}
    div[step0] { width:100vw;height:25vh}
    div[step1] { width:100vw;height:45vh}
    div[step2] { width:100vw;height:80vh}
    div[step3] { width:100vw;height:40vh}
    #pitchtext { margin-left:20px; height:10vh;}
    .large { font-size:5vw; font-weight: 600;}
    p {font-size: 16px; margin:8px;}
    #psrofile { background-image:url('/images/profile.jpg');background-size:100% 100%;width:100%;height:80vh;margin-bottom:20px;}
    paper-input[disabled] {margin-bottom:140px;}
    paper-input[focused] {border:3px solid #71d1a4;}
    paper-input { margin-bottom:165px;margin:auto;width:50vw;background-color:white;border-radius:5px;padding-left:5px;padding-right:5px;min-width: 315px;}
    paper-icon-button { border-radius:20px;margin-left:20px;margin-right:20px;background-color:none;color:white;border:0px solid black;}
    paper-button { border-radius:20px; padding-left:25px; padding-right:25px; text-transform: capitalize;margin-right:20px;background-color:#43BC84;color:white;border:0px solid black; height:70px; width: 200px;}
    #spacer { flex:1;}
    paper-button[disabled] { opacity:0.5}
    #toolbar { width:100vw;display:flex;justify-content:flex-end;align-items:center; }
    #toolbar paper-button {margin-bottom: 30px; margin-top: 30px;padding-left:20px;padding-right:20px;}
    #wizard { position:absolute;display:flex;bottom:-50vh;height:50vh;flex-wrap:wrap;align-items:flex-end;width:100vw;background-color:none;transition:bottom 0.2s ease-in-out, height 0.2s ease-in-out}
    #wizard[step="0"] { bottom:1vh;height:55vh;background-color:#0082c9;}
    #wizard[step="1"] { bottom:1vh;height:72vh;background-color:#0082c9;}
    #wizard[step="2"] { bottom:1vh;height:85vh;background-color:#0082c9;}
    #wizard[step="3"] { bottom:1vh;height:55vh;background-color:#0082c9;}
    #wizard.toolbar { bottom:65px;}
            .item-c { background:red;}

    </style>
    <ico-wizard id="wizard" progressbar progressbar-style="small" showfinish step="{{step}}" on-step-changed="_onStep" on-complete="_completeRegistration">
        <div step3>
            <ico-grid flex id="photoselect" items="{{registrationdata.thumbs}}" selected-object="{{registrationdata.thumb}}">
                <img height="100%" width="100%" src="{_{item}_}" />
            </ico-grid>
        </div>

        <div step2  on-close="_stopRecording" on-open="_startRecording">
            <div style="width:100vw;height:75%">
                <ico-recorder id="recorder" videoblob="{{registrationdata.video}}" counter="1" thumbs="{{registrationdata.thumbs}}" on-recording-complete="_completeRecording"></ico-recorder>
            </div>
            <div id="pitchtext" style="margin-top:40px;">
                <p class="large">Persoonlijke pitch van 7 seconden</p>
                <p>Stel jezelf voor aan andere bezoekers van [evenement]</p>
            </div>
        </div>
        <div step0>
            <paper-input value="{{registrationdata.username}}" label="Voornaam + Achternaam" always-float-label placeholder="Je naam"></paper-input>
        </div>
        <div step1>
            <paper-input value="{{registrationdata.username}}" class="done" disabled label="voornaam + achternaam"></paper-input>
            <paper-input value="{{registrationdata.company}}"  label="Omdat we het nog wel een beetje zakelijk moeten houden" always-float-label placeholder="Je bedrijfsnaam"></paper-input>
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
        registrationdata:{type:Object, value:{ thumbs:[]}, notify:true},
        nextstep:{ type:String, value:"Start registratie", notify:true}
    }}
    reset(){
        this.step = -1;
        this.registrationdata = { thumbs:[]};
        
    }
    start() {
        if (this._hasToolbar()) { this.$.wizard.classList.add("toolbar")}; 
        import('../node_modules/@iconica/iconicaelements/ico-wizard.js');  
    }
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
        if (step.detail.value == 2) import ("../node_modules/@iconica/iconicaelements/ico-recorder.js").then(() => {
            this.$.recorder.init(false);
        });
        if (step.detail.value == 3) { this.$.photoselect.select(0);this.$.photoselect.render();}
    }
    _completeRegistration(){
        this.dispatchEvent(new CustomEvent("registration-complete", { detail: this.registrationdata }));
        this.reset();
    }

    _hasToolbar(){
        return false;//window.outerHeight < (screen.height-24);
    }
}

customElements.define('ico-registration', IcoRegistration);

