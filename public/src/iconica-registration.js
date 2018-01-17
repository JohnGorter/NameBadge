// @ts-check

import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '../node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/paper-input/paper-input.js'

const template = `
        <style is="custom-style" include="app-styles">
        </style>

    <ico-wizard id="wizard" progressbar progressbar-style="small" showfinish step="{{step}}" on-step-changed="_onStep" on-complete="_completeRegistration">
        <div step4 on-open="_generateBarcode">
           badge barcode
           <svg id="barcode"></svg>   
           <paper-button on-tap="_printbadge">Print badge</paper-button> 
        </div>
        <div step3>
            <ico-grid flex id="photoselect" items="{{registrationdata.thumbs}}" selected-object="{{registrationdata.thumb}}">
                <img height="100%" width="100%" src="{_{item}_}" />
            </ico-grid>
        </div>

        <div step2 on-close="_stopRecording" on-open="_startRecording">
             <ico-recorder id="recorder" videoblob="{{registrationdata.video}}" counter="0" recordingtime="1" thumbs="{{registrationdata.thumbs}}" on-recording-complete="_completeRecording"></ico-recorder>
            <div id="details" class="shown">
                <div id="backpanel" class="registration-back_panel">
                   <div><p class="large">Persoonlijke pitch van 7 seconden</p></div>
                  <div><p>Stel jezelf voor aan andere bezoekers van [evenement]</p></div>
                </div>
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
            <paper-button id="command" on-click="_record" hidden>command</paper-button>
            <paper-button id="next" nextpage>{{nextstep}}</paper-button>
        </div>
</ico-wizard>
`;

export class IcoRegistration extends PolymerElement {
    static get template(){ return template;}
    static get properties() { return { 
        step:{type:Number, notify:true},
        registrationdata:{type:Object, value:{ thumbs:[]}, notify:true, readOnly:false},
        nextstep:{ type:String, value:"Start", notify:true}
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
        this.$.next.hidden = true;
        this.$.command.innerText = "Record"; 
        this.$.command.hidden = false;
        this.$.command.style.backgroundColor = "red";
    }
    _record() {
        this.$.wizard.hidetoolbar = true;
        this.$.backpanel.classList.add("hidden");
        this.$.recorder.start();
        this.$.command.hidden = true;
        this.$.next.disabled = true;
        this.$.previous.disabled = true;
    }
    _completeRecording() {
        this.$.next.hidden = false;
        this.$.next.disabled = false; 
        this.$.previous.disabled = false;
        this.$.wizard.hidetoolbar = false;
        this.$.backpanel.classList.remove("hidden");
    }
    _onStep(step){
        this.$.command.hidden = true;
        if(step.detail.value == 0) this.nextstep = "Start";
        if(step.detail.value >= 1) this.nextstep = "Volgende";
        if (step.detail.value == 2) import ("../node_modules/@iconica/iconicaelements/ico-recorder.js").then(() => {
            this.$.recorder.init(false);
        });
        if (step.detail.value == 3) { this.$.photoselect.select(0);this.$.photoselect.render();}
        if (step.detail.value == 3) { this.nextstep = "Finish";}
    }
    _completeRegistration(){
        this.dispatchEvent(new CustomEvent("registration-complete", { detail: this.registrationdata }));
        this.reset();
    }
    _printbadge(){
        print();
    }

    _generateBarcode(){
        JsBarcode(this.$.barcode, this.registrationdata.username, {displayValue: false});
    }

    _hasToolbar(){
        return false;//window.outerHeight < (screen.height-24);
    }
}

customElements.define('ico-registration', IcoRegistration);

