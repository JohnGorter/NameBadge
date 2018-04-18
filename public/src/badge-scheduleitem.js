import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from  '/node_modules/@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from  '/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js';

const html = String.raw;
const htmlTemplate = html`
    <custom-style>
      <style is="custom-style" include="paper-material-styles"></style>
    </custom-style>
        <style>
       
        :root { margin-top:10px;margin-bottom:10px;}
        .card .circle { background-color:white;border-radius:50%;border:2px solid Navy;width:20px;height:20px;position:absolute;top:50px;left:-14px;}
        .card .reserved { background-color:var(--tint-color); }
        .time .timedetail { line-height:50px;font-size:20px;width:100%; margin-left:50px;height:50px; }
        .card { position:relative;left:22px;display:flex;width:92vw;background-color:white;}
        div.markedold {border: 4px solid var(--second-tint-color); border-radius: 7px; }
        .hidden { display:none;}
        .details { display:flex;flex-flow:column;height:120px;width:100%;color:var(--main-text-color);}
        .details .toolbar { height:18px;border-top: 0.5px solid silver;padding-left:10px;padding-bottom:10px;padding-top:5px;display:flex;justify-content:flex-end;}
        .details .info { height:150px;padding-left:20px;padding-right:20px;padding-top:10px;display:flex;justify-content:flex-end;line-height:25px;flex-wrap:wrap;}
        .details .info iron-icon { --iron-icon-fill-color:var(--tint-color);margin-right:5px;height:20px;width:20px;}
        .details .info h1 { position:relative;top:0px;width:100%;font-size:12px;justify-self:flex-start;padding-top:0px;margin:0px;color:var(--tint-color);line-height:16px;}
        .subtle { font-size:10px;font-weight:lighter;font-family:sans-serif;display:flex;flex-flow:row;justify-content:flex-end;}
        .details span.reviewed { opacity:0.2}
        iron-icon.disabled { opacity:0.5}
        </style>
        <badge-confirm id="confirm" on-close="_saveReview"></badge-confirm>
        <div class$="{{_getCardClass(filter, onlyMe, item.marked)}}" elevation="1">
            <template is="dom-if" if="{{!nocircle}}">
                <div on-tap="_markEvent" class$="{{_getCircleClass(item.reserved, item.marked)}}"></div>
            </template>
                 <img on-tap="_selectEvent" src="[[item.img]]" style="min-width:120px;max-width:120px;height:140px;">
                <div class="details">
                    <div class="info"  on-tap="_selectEvent">
                        <div class="subtle" style="flex:1">
                        <!-- <iron-icon icon="perm-identity" style="top:-3px;"></iron-icon>Jeroen Salemink</span> -->
                            <iron-icon icon="maps:place"></iron-icon><span class="subtle">[[item.location]]
                        </div>
                        <h1 style="font-size:3vw;">[[item.item]]</h1>
                    </div>
                    <div class="toolbar">
                    <!-- <span on-tap="_selectEvent" style="user-select: none; margin: 10px;right: 10px;position: absolute; color: var(--tint-color);">Bekijk</span> 
                    <badge-rating disabled="[[_isReviewed(item.isReviewed)]]" on-rating-changed="_persistRating" rating="{{rating}}"></badge-rating>-->
                        <template is="dom-if" if="[[_showIcon(item.marked)]]">
                            <iron-icon on-tap="_markEvent" style="color: var(--tint-color);margin-top:5px;margin-right:10px;" class$="[[_getIconClass(item.marked)]]" icon="[[_getIcon(item.marked)]]"></iron-icon>
                        </template>
                    </div>
                </div>
        </div>
`;

export class BadgeScheduleItem extends GestureEventListeners(PolymerElement) {
    static get template() { return htmlTemplate; }
    static get observers() { return ['_markItem(item.*)'];}
    static get properties() {
        return {
            nocircle: { type:Boolean, value:false},
            item:{ type:Object, notify:true, observer:'_markItem'},
            hour: { type:String },
            onlyMe: { type:Boolean},
        }
    }
  
    _markItem(){
        this.set('item.marked', ("event_" + this.item.id + "_mark" in localStorage));
    }

    _getAddSessionText(){
        return this.item.marked ? this.onlyMe ? "Verwijder" : "" : "Voeg toe";
    }
    _markEvent() {
       
       // this.set('marked', newval);
     //  if (this.item.marked == true && !this.onlyMe) {}
      // else
      // {
        var newval = !this.item.marked;
          this.dispatchEvent(new CustomEvent('mark-event', { detail: { id:this.item.id, mark:newval }, bubbles:true, composed:true}));
      // }
    }
    _selectEvent(e){
        this.dispatchEvent(new CustomEvent('show-details', { detail: { event:this.item.id, hour:this.hour, marked:this.item.marked }, bubbles:true, composed:true}));
    }
    _getCircleClass(){
        return "circle " + (this.item.reserved ? "reserved ":"") + (this.item.marked ? "marked " : "");
    }

    _getIcon(m){
        return this.onlyMe ? "clear" : m ? "favorite" : "favorite-border";
    }
    _showIcon(m){
        return true;// (!this.onlyMe && !m) || this.onlyMe;
    }

    _getIconClass(m){
        return this.onlyMe ? "" : m ? " disabled" : "";
    }

    _getCardClass(f, o, m){
        var filter = f.toLowerCase();
        var cssclass =  "card paper-material " +  ((filter == "" || this.item.item.toLowerCase().indexOf(filter) >= 0 || this.item.location.toLowerCase().indexOf(filter) >= 0) ? "" : "hidden ");
        cssclass += (o && !("event_" + this.item.id + "_mark" in localStorage)) ? "hidden " : "";
        cssclass += (!o || (o && m)) ? "" : "hidden ";
        cssclass += !o && m ? "marked " : "";
        return cssclass; 
    }

    connectedCallback(){
        super.connectedCallback(); 
       
    }

    _trim(item, length){
        if (item.length > length) return item.substring(0, length-3) + "..." 
        else return item;
    }   
    // _getCaption(reviewed) {
    //     return reviewed || this.review ? "" : "Beoordeel";
    // }
    _getClass(reviewed) {
        return reviewed || this.review ? "reviewed":"";
    }
   
    // _reviewEvent(){
    //     if (!this.item.isReviewed) {
    //     // this.dispatchEvent(new CustomEvent('review-event', { detail:this.event, bubbles:true, composed:true}));
    //     this.$.confirm.open("Weet u het zeker?", "Weet u zeker dat u deze beoordeling wil versturen?");
    //     }
    // }
    
}


customElements.define('badge-scheduleitem', BadgeScheduleItem);