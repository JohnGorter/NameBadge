import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';

const html = String.raw;
const htmlTemplate = html`
     <custom-style>
        <style is="custom-style" include="paper-material-styles"></style>
    </custom-style>
    <style>
        :host { width:100vw;background-color:#efefef;top:70px;position:absolute;}
        .container { overflow:scroll;height:80vh;position: relative;}
        .time { height:50px;position:relative;}
        .line { background-color:#040356;width:2px;position:absolute;left:20px; }
        .noline { background-color:transparant;width:2px;position:absolute;left:20px; }
        .time .circle { display:flex;justify-content:center;align-items:center;background-color:white;border-radius:50%;border:2px solid #040356;width:20px;height:20px;position:absolute;top:12px;left:-12px;}
        .time .collapsed { background-color:#6363a9;}
        .time .onlyMe { background-color:var(--tint-color);}
        .time .timedetail { color:#040356;display:flex;line-height:50px; margin-left:50px;width:87vw;position:relative;left:-20px;}
        .filterbar { text-align:center;font-size:12px;font-family:sans-serif;font-weight:lighter;top:-10px;height:40px;background-color:var(--second-tint-color);color:var(--text-primary-color);line-height:40px;padding-left:20px;}
        .toolbartabs { top:-10px;--paper-tabs-selection-bar-color: #040356;color:var(--text-primary-color);background-color:var(--second-tint-color)}
    </style>
    <paper-tabs selected="{{selected}}" class="toolbartabs paper-material" elevation="1">
        <paper-tab>Alle Sessies</paper-tab>
        <paper-tab>Mijn Sessies</paper-tab>
    </paper-tabs>
    <template is="dom-if" if="[[filter]]">
        <div id="filterbar" class="paper-material filterbar" elevation="1">
            Huidige zoekcriteria '[[filter]]' <span on-tap="_clearFilter" style="margin-left:20px;"><iron-icon style="height:16px;width:16px;" icon="clear"></iron-icon></span>
        </div>
    </template>
    <iron-pages id="pages" selected="{{selected}}">
        <div>
            <div class="container">
                <div class="noline"></div>
                <template id="list" is="dom-repeat" items="{{schedule}}" as="hour" initial-count="5">
                    <template is="dom-if" if="{{_hasHourItems(index)}}">
                        <div class="time"><div class="line"></div>
                        <!-- <div class$="{{_getCircleClass(hour.collapsed, onlyMe)}}"> </div> -->
                        <div on-tap="_expand" class="timedetail">
                                <div>{{hour.hour}}</div>
                                <template is="dom-if" if="{{hour.collapsed}}">
                                    <div style="font-size:10px;flex:1;text-align:right;padding-right:30px;margin-top:2px;">  {{_getSubItems(index)}} verborgen sessies tussen {{hour.hour}}</div>
                                </template>
                        </div></div>
                        <template is="dom-if" if="{{!hour.collapsed}}">
                            <template is="dom-repeat" items="{{hour.items}}" initial-count="5" >
                                <badge-scheduleitem 
                                    on-show-details="_showDetails" 
                                    on-mark-event="_markEvent"
                                    item="{{item}}" 
                                    nocircle
                                    reserved="{{_isReserved(item)}}"
                                    marked="[[_isMarked(item)]]"
                                    hour="{{hour.hour}}"
                                    filter="{{filter}}">
                                </badge-scheduleitem>
                            </template>
                        </template>
                    </template>
                 </template> 
            </div>
        </div>
        <div>
            <div class="container">
                <div class="noline"></div>
                <template id="mylist" is="dom-repeat" mutable-data items="{{schedule}}" as="hour" initial-count="5" >
                    <div class="time"><div class="line"></div>
                    <!-- <div class$="{{_getCircleClass(hour.collapsed, onlyMe)}}"> </div> -->
                    <div on-tap="_expand" class="timedetail">
                            <div>{{hour.hour}}</div>
                            <template is="dom-if" if="{{hour.collapsed}}">
                                <div style="font-size:10px;flex:1;text-align:right;padding-right:30px;margin-top:2px;">  {{_getSubItems(index)}} verborgen sessies tussen {{hour.hour}}</div>
                            </template>
                    </div></div>
                    <template is="dom-if" if="{{!hour.collapsed}}">
                        <template is="dom-repeat" items="{{hour.items}}" initial-count="5" on-dom-change="_schedulerendered" >
                            <badge-scheduleitem 
                                on-mark-event="_markEvent"
                                item="{{item}}" 
                                nocircle="false"
                                reserved="{{_isReserved(item)}}"
                                marked="[[_isMarked(item)]]"
                                only-me
                                hour="{{hour.hour}}"
                                filter="{{filter}}">
                            </badge-scheduleitem>
                        </template>
                    </template>
                </template> 
            </div>
        </div>
    </iron-pages>
`

export class BadgeSchedule extends PolymerElement {
    static get template() {return htmlTemplate;}
    static get properties() { return {
        selected: {type:Number, value:0, observer:'_tabchanged'},
        filter: { type:String, value:"", notify:true, observer:'_setBarDisplay'},
        agenda: { type:Array },
        schedule:{ type:Array }
    } };

    _tabchanged(){
        var schedule = this.schedule;
        this.schedule = [];
        this.schedule = schedule;
        this.notifyPath('schedule');
        
    }

    // filtetren van lege items werkt niet :-()
    _hasHourItems(index){
        return this.selected == 0 || this.schedule[index].items.find(i => i.marked == true);
    }
    _setBarDisplay(){
       if (this.filter != ""){ 
         var filterbar = this.shadowRoot.querySelector("#filterbar")
         if (filterbar) 
            filterbar.style.display="block";
       }
    }
    _clearFilter(){
        this.shadowRoot.querySelector("#filterbar").style.display="none";
        setTimeout( () => {
             this.filter = "";
        }, 0);
    }
    
    _filter(f){
        return (i)=> {
            return this.filter == "" || i.item.toLowerCase().indexOf(this.filter) != -1 || i.location.toLowerCase().indexOf(this.filter) != -1;
        }
    }

    _getCircleClass(collapsed, onlyMe){
        return "circle " + (collapsed? "collapsed ":"") + (onlyMe? "onlyMe ": "");
    }
    _isReserved(item){
        if (this.username != "" && this.agenda)
            for (var agendaitem of this.agenda){
                if (agendaitem.item == item.item) return true;
            }
        return false;
    }

    _isMarked(item){
        return ("event_" + item.item + "_mark" in localStorage);
    }

    _expand(e){
        //if (this.filter == "") {
            this.schedule[e.model.index].collapsed = !this.schedule[e.model.index].collapsed;
            this.notifyPath('schedule.' + e.model.index + '.collapsed');
       // }
    }

    _getSubItems(index){
        return this.schedule[index].items.length;
    }
    _markEvent(e){
        if (e.detail.mark) {
            console.log("Adding mark", "event_" + e.detail.event + "_mark");
            localStorage["event_" + e.detail.event + "_mark"] = "1";
         //   e.target.marked = true;
        }
        else {
            console.log("Removing mark", "event_" + e.detail.event + "_mark");
            delete localStorage["event_" + e.detail.event + "_mark"];
         //   e.target.marked = false;
        }

        
        for (var i in this.schedule)
            for (var j in this.schedule[i].items)
                if (this.schedule[i].items[j].item ==  e.detail.event) {
                    this.schedule[i].items[j].marked = e.detail.mark;
                    this.notifyPath('schedule.' + i + '.items.' + j + '.marked');
                }
    }
    _matches(item){
       return item.hour == parent.hour;
    }
    _getItems(hour){
        var items = this.schedule.filter ((i) =>  i.hour == hour);
        return items;
    }

    _schedulerendered(){
        console.log("schedule rendered");
    }


   
}


customElements.define('badge-schedule', BadgeSchedule);