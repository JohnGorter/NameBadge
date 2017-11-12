import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import '/node_modules/@polymer/paper-button/paper-button.js'
import '/node_modules/@polymer/iron-icons/iron-icons.js'
import '/node_modules/@polymer/paper-icon-button/paper-icon-button.js'
import '/node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js'
import '/node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js'
import '/node_modules/@polymer/app-layout/app-header/app-header.js'
import '/node_modules/@polymer/paper-progress/paper-progress.js'
import '/node_modules/@polymer/iron-pages/iron-pages.js'
import './iconica-registration.js'

var template = `
       <style>
        :host { font-family: 'Roboto'; } 
        app-toolbar { background-color:var(--main-toolbar-bg-color, #101654);color:var(--main-color, white);}
        .main { display:flex;flex-wrap:wrap;align-content:flex-start;align-items:flex-start;font-family: 'Roboto', sans-serif;color:var(--main-color, white); background-color:var(--main-bg-color, #101654); width:100vw; height:92vh;}
        .textplace { font-size:42px;padding-top:33vh;padding-left:20px;padding-bottom:15px;min-width:100vw;transition:padding-top 0.1s ease-in-out;}
        .textplace.step1 { font-size:42px;padding-top:18vh;padding-left:20px;min-width:100vw;}
        .textplace.step4 { font-size:42px;padding-top:5vh;padding-left:20px;min-width:100vw;}
        #title { font-size:10vw;}
        #title.larger { font-size:10vw;}
        #details { font-size:3.8vw;margin-top:5px;}
        .small { font-size:14px}
        .hidden { opacity:0;}
       </style>
       <app-header-layout>
            <app-header slot="header" fixed condenses effects="waterfall">
               <app-toolbar><img height="30" src="/images/smartbadgeicon.png"></app-toolbar>
           </app-header>
           <div class="main" on-tap="nextPage">   
                <div class="textplace" id="textplace">
                    <div id="title" class$="{{_getStepClass(step)}}">{{_getStepTitle(step)}}</div>
                    <div id="details">{{_getStepDetails(step)}}</div>
                </div>
            </div>
            <ico-registration id="registration" username="{{username}}" step="{{step}}"></ico-registration>
       </app-header-layout>
`;

export class MyApp extends GestureEventListeners(PolymerElement) {
    static get template(){ return template; }
    
    static get properties(){ return {
        step: { type:Number, value:-1, notify:true},
        page:{ type:Number, value:0},
        videos: { type:Array, value:[]},
        data:{ observer:'_videoStored'}
    }}

    connectedCallback(){
        super.connectedCallback();
       
        this.titles = ["Get on board!","Hallo {{username}}!", "","","Kies de foto voor op je badge"];
        this.details = ["","Wij willen je [badge] graag voorzien van je bedrijfsnaam","", "", "Wij hebben speciaal voor jou een selectie foto's gemaakt"];
        this.title = this.titles[0];
        this.detail = this.details[0];
    }

    _getStepClass(step) {
        return step < 1 ? "larger": "";
    }
    _getStepTitle(step){
        if (step == -1) return "Get on board!";
        if (step >= 0)
            this.$.textplace.classList.add("step"+step);
        if (step >= 0 && this.titles.length > this.step)
            return (step >= 0)? this.titles[step].replace("{{username}}", this.username) : "";
        return "";
    }
    _getStepDetails(step){
        if (step >= 0 && this.details.length > this.step)
            return (step >= 0)? this.details[step] : "";
        return "";
    }

    _hide(step, currstep){
        return step == currstep || currstep == undefined;
    }
    _videoStored(){
        console.log('video stored');
    }
    nextPage(){
        import('./iconica-registration.js').then(() => {
            this.$.registration.start();
        });
    }
    _hasToolbar(){
        return window.outerHeight < (screen.height-24);
    }
}

customElements.define('my-app', MyApp);