import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js';

const htmlTemplate = `
   <style>
   :host { position:absolute;background-color:#454545;z-index:50;top:0px;width:100vw;height:100vh;display:flex;justify-content:center;}
   .container { width:80vw;background-color:white;height:101vh;display:flex;flex-flow:row;justify-content:center;}
   .pagecontainer { font-family:roboto;display:flex;flex-flow:column;align-items:center;text-align:center;color:#343434;height:90vh;background-color:white;padding-left:15vw;padding-right:15vw;}
   .pagecontainer h1 { font-size:24px;}
   .pagecontainer p { font-size:14px;line-height:2;}
   .pagecontainer img { padding-top:50px;}
   div[step0] .pagecontainer { background-color:#f1f1f1;}
   div[step0] h1,div[step0] p { color:#343434;}
   div[step1] .pagecontainer { background-color:#096BA6;}
   div[step1] h1,div[step1] p { color:white;}
   div[step2] .pagecontainer { background-color:#43BC84;}
   div[step2] h1,div[step2] p { color:white;}
   div[step3] .pagecontainer { background-color:#f1f1f1;}
   div[step3] h1,div[step3] p { color:#343434;}
   .skip {position: fixed;right: 25px;}
   ico-wizard.page0 { width:100vw;background-color:#f1f1f1}
   ico-wizard.page1 { width:100vw;background-color:#096BA6;}
   ico-wizard.page2 { width:100vw;background-color:#43BC84;}
   ico-wizard.page3 { width:100vw;background-color:#f1f1f1;}
   paper-fab { position:fixed;right:20px;bottom:60px;background-color:#454545;opacity:0.7;}
   
   </style>
   <div class="container">
    <ico-wizard id="wizard" progressballs class="page0">
        <div step0 on-close="animateToLeft">
            <div class="pagecontainer">
                <p class="skip">overslaan</p>
                <img width="250" height="250" src="/images/zeshoek.svg"></img>
                <h1>Digitaal het evenement beleven</h1>
                <p>Met de Smartbadge app wordt het netwerken net even wat effectiever en leuker.</p>
                <paper-fab icon="arrow-forward" on-tap="_nextpage"></paper-fab>
            </div>
        </div>
        <div step1>
            <div class="pagecontainer">
                <p class="skip">overslaan</p>
                <img width="250" height="250" src="/images/zeshoek.svg"></img>
                <h1>On- en offline beschikbaarheid</h1>
                <p>Slechte internet verbinding op het evenement?</p>
            <paper-fab icon="arrow-forward" on-tap="_nextpage"></paper-fab>
            </div>
        </div>
        <div step2>
            <div class="pagecontainer">
                <p class="skip">overslaan</p>
                <img width="250" height="250" src="/images/zeshoek.svg"></img>
                <h1>Sla je leukste connecties op!</h1>
                <p>Heb je iemand leren kennen op het evenement? Dan kan je zijn of haar gegevens gemakkelijk opslaan door de badge te scannen of simpel op het label knopje te drukken.</p>
            <paper-fab icon="arrow-forward" on-tap="_nextpage"></paper-fab>
            </div>
        </div>
        <div step3>
            <div class="pagecontainer">
                <p class="skip">overslaan</p>
                <h1 style="margin-top: 30vh;">Personaliseer je app!</h1>
                <p>Door je emailadres van registratie bij Gribbio in te voeren, kunnen wij je persoonlijke agenda inladen.</p>
                <paper-input label="username">
                    <iron-icon icon="mail" slot="prefix"></iron-icon>
                    <div slot="suffix">@email.com</div>
                </paper-input>
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