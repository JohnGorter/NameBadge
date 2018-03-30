import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js';

const htmlTemplate = `
   <style>
   :host { position:absolute;background-color:#454545;z-index:50;top:0px;width:100vw;height:100vh;display:flex;justify-content:center;}
   .container { width:80vw;background-color:white;height:100vh;display:flex;flex-flow:row;justify-content:center;}
   .pagecontainer { font-family:roboto;font-style:bold;display:flex;flex-flow:column;align-items:center;text-align:center;color:#343434;height:90vh;background-color:white;padding-left:50px;padding-right:50px;}
   .pagecontainer h1 { font-size:24px;}
   .pagecontainer p { font-size:10px;line-height:1.5;}
   .pagecontainer img { padding-top:50px;}
   div[step0] .pagecontainer { background-color:white;}
   div[step0] h1,div[step0] p { color:#343434;}
   div[step1] .pagecontainer { background-color:#2196F3;}
   div[step1] h1,div[step1] p { color:white;}
   div[step2] .pagecontainer { background-color:#1de9b6;}
   div[step2] h1,div[step2] p { color:white;}
   div[step3] .pagecontainer { background-color:white;}
   div[step3] h1,div[step3] p { color:#343434;}
   .skip { align-self:flex-end}
   ico-wizard.page0 { width:80vw;background-color:white;}
   ico-wizard.page1 { width:80vw;background-color:#2196F3;}
   ico-wizard.page2 { width:80vw;background-color:#1de9b6;}
   ico-wizard.page3 { width:80vw;background-color:white;}
   paper-fab { position:fixed;right:37px;bottom:20px;background-color:#454545;opacity:0.7;}
   
   </style>
   <div class="container">
    <ico-wizard id="wizard" progressballs class="page0">
        <div step0 on-close="animateToLeft">
            <div class="pagecontainer">
                <p on-tap="_finish" class="skip" style="right: 40px;position: absolute; ">overslaan</p>
                <img style="padding-left: 0px;padding-right: 0px;width: 120px;" src="/images/zeshoek.svg"></img>
                <h1>Digitaal het evenement beleven</h1>
                <p>Met de Smartbadge app wordt het netwerken net even wat effectiever en leuker.</p>
                <paper-fab icon="arrow-forward" on-tap="_nextpage"></paper-fab>
            </div>
        </div>
        <div step1>
            <div class="pagecontainer">
                <p on-tap="_finish" class="skip" style="right: 40px;position: absolute; ">overslaan</p>
                <img style="padding-left: 0px;padding-right: 0px;width: 120px;" src="/images/zeshoek.svg"></img>
                <h1>On- en offline beschikbaarheid</h1>
                <p>Slechte internet verbinding op het evenement?</p>
            <paper-fab icon="arrow-forward" on-tap="_nextpage"></paper-fab>
            </div>
        </div>
        <div step2>
            <div class="pagecontainer">
                <p on-tap="_finish" class="skip" style="right: 40px;position: absolute; ">overslaan</p>
                <img style="padding-left: 0px;padding-right: 0px;width: 120px;" src="/images/zeshoek.svg"></img>
                <h1>Sla connecties op!</h1>
                <p>Heb je iemand leren kennen op het evenement? Dan kan je zijn of haar gegevens opslaan door de badge te scannen.</p>
            <paper-fab icon="arrow-forward" on-tap="_nextpage"></paper-fab>
            </div>
        </div>
        <div step3>
            <div class="pagecontainer">
                <p on-tap="_finish" class="skip" style="right:15%;position: absolute; ">overslaan</p>
                <h1 style="margin-top:50px">Personaliseer je app!</h1>
                <p>Door je eigen badge te scannen, kunnen wij je persoonlijke agenda inladen.</p>
                <badge-scanner id="scanner" on-badge-scanned="badgescanned"></badge-scanner>
            <paper-fab label="Start" style="padding:0px;" on-tap="_finish"></paper-fab>
            </div>
        </div>
    </ico-wizard>
    {{install}}
    <badge-tutorialdata appinstall="{{completed}}"></badge-tutorialdata>
   </div>
`; 

export class BadgeTutorial extends GestureEventListeners(PolymerElement) {
    static get template() { return htmlTemplate;}
    _nextpage(){
        this.$.wizard.nextPage();
        this.$.wizard.classList.add('page' + this.$.wizard.step);
    }
    _finish(){
        this.completed = "finished on " + Date.now();
        this.classList.add("hide");
    }
}


customElements.define('badge-tutorial', BadgeTutorial);