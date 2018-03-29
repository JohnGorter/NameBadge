import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'
import { GestureEventListeners } from  '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js';


const html = String.raw;
const htmlTemplate = html`
        <style is="custom-style" include="app-styles">
        #dialog { display:flex;align-items:center;}
        .reviewed { font-size:10px;font-style:italic;margin-top:20px;}
        </style>
        <badge-confirm id="confirm" on-close="_saveReview"></badge-confirm>
        <paper-dialog style="background-color:#232323;top:0px;z-index:999;overflow:hidden;height:100vh;width:100vw;margin:0px;position:absolute;" id="dialog" style="margin:10px" on-iron-overlay-closed="close">
            <div style="background-color:white;margin:0px;padding:0px;width:90%;margin:5%;position:absolute">
            <div>
                    <div style="padding:15px">
                        <div style="display:flex;align-items:center">
                            <img style="height:80px;margin-right:20px;" src="[[event.img]]"> 
                            <h1 style="color:var(--tint-color);line-height:30px;overflow:hidden;">[[_trim(event.item, 60)]]</h1>
                        </div>
                    <p style="margin:0px;margin-top:5px;height:20vh;overflow:hidden;">[[_trim(event.description, 530)]]</p><br/>

                    <div style="display:flex;flex-wrap:wrap;">
                        <template is="dom-repeat" items="[[selectedEvent.tags]]">
                            <div style="font-size:8px;color:var(--text-primary-color);background-color:var(--tint-color);border-radius:5px;margin:2px;padding-left:5px;padding-right:5px;">{{event.item}}</div>
                        </template>
                    </div>

                     <div style="display:flex;flex-wrap:wrap;font-size:10px;margin-top:10px;">
                       <div style="flex:1;">
                            <p><iron-icon style="color:var(--tint-color);margin-right:5px;" icon="device:access-time"></iron-icon>[[hour]]</p>
                       </div>
                       <div style="flex:1">
                             <p><iron-icon style="color:var(--tint-color);margin-right:5px;" icon="maps:place"></iron-icon>[[event.location]]</p>
                       </div>
                    </div>

                     <template is="dom-if" if="[[_isReviewed(event.isReviewed)]]">
                    <div style="margin-bottom: 10px;">
                        <div class="reviewed">U heeft deze sessie beoordeeld met:</div>
                        <badge-rating disabled rating="{{rating}}"></badge-rating>
                    </div>
                    </template>
                </div>
            </div>
            <div style="width: 100%;bottom:0px;height:64px;line-height:60px;">
                <hr style="margin:0px;0.5px solid silver;width:89.5vw" />
                <template is="dom-if" if="[[!_isReviewed(event.isReviewed)]]">
                <badge-rating style="padding-left:10px;" disabled="[[_isReviewed(event.isReviewed)]]" rating="{{rating}}"></badge-rating>
                <span on-tap="_persistRating" style="user-select: none;right: 80px;position: absolute; color: var(--tint-color);" dialog-dismiss>Beoordeel</span>
                </template>
                <span style="user-select: none;right: 20px;position: absolute; color: var(--tint-color);" dialog-dismiss>Sluiten</span>
            </div>
        </div>
       </paper-dialog>`;

export class BadgeEventDetails extends GestureEventListeners(PolymerElement) {
    static get template() {
        return htmlTemplate;
    }
    static get properties(){
        return {
            event: { type:Object, notify:true, observer:'_setEventDetails'},
            hour: { type:String, notify:true},
            rating: { type:Number }
        }
    }

    connectedCallback(){
        super.connectedCallback(); 
    }

    _setEventDetails(){
       this.set('event.isReviewed', window.localStorage[this.event.item.replace(" ", "-") + "-review"]);
       this.rating = window.localStorage[this.event.item.replace(" ", "-") + "-review"] || 0;
    }

    _trim(item, length){
        if (length == -1) return item;
        if (item.length > length) return item.substring(0, length-3) + "..." 
        else return item;
    }

    open(event, hour) {
        this.event = event;
        this.hour = hour;
        this.$.dialog.open();
    }

    _close(){
        this.dispatchEvent(new CustomEvent('close', { detail: { value: this.value }, bubbles:true, composed:true}));
    }
    _saveReview(){
        this.set('event.isReviewed', this.rating);
        window.localStorage[this.event.item.replace(" ", "-") + "-review"] = this.rating;
    }

    _isReviewed(reviewed){
        return reviewed || this.review;
    }

    _persistRating(){
        if (!this.event.isReviewed) {
            // this.dispatchEvent(new CustomEvent('review-event', { detail:this.event, bubbles:true, composed:true}));
            this.$.confirm.open("Weet u het zeker?", "Weet u zeker dat u deze beoordeling wil versturen?");
        }
    }
}


customElements.define('badge-eventdetails', BadgeEventDetails);