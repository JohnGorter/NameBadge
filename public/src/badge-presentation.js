// @ts-check 
import '/node_modules/@polymer/polymer/polymer.js'
import { GestureEventListeners } from '../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js'
import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import '/node_modules/@polymer/iron-pages/iron-pages.js'

const htmlTemplate = ` 
    <custom-style>
        <style is="custom-style" include="paper-material-styles"></style>
    </custom-style>
    <style is="custom-style" include="app-styles"> 
        #grid { display:flex;flex-flow:wrap;margin-left:2px; margin-top:35px;height: 76vh;align-items: flex-start;
            align-content: flex-start;}
        #grid_lastvisited { display:flex;flex-flow:wrap;margin-left:2px; margin-top:35px;height: 76vh;align-items: flex-start;
            align-content: flex-start;}

    #details { 
        transition:bottom 0.45s ease-in-out;
        position:relative;
        bottom:0vh;
        background-color:var(--light-primary-color);
        display:flex;
        align-items:center;
        justify-content:center;
        position:relative;
        bottom:-85vh;
        height:30vh;
        } 

       #details.shown {  
        position:relative;
        bottom:-35vh;
        height:30vh;
        }


      .info_details { 
        width:50vw;
        height:200px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        }

      .info_username { 
        color:var(--text-primary-color);
        font-size:5vw;
      }

      .info_company { 
        color:var(--text-primary-color);
        font-size:16px;
        margin-top:12px;
        }

      .back_panel {
        position:absolute;
        left:20px;
      } 

      .empty-recent {display: flex; align-items: center; justify-content: center; width: 100%; height: 75%; font-family: roboto; color: #444; text-shadow: 3px 6px 5px #666;}
      .hidden { display:none;}
      .card { border-radius:3px;height:45vw; width:45vw;margin-bottom:20px;margin-left:10px;background-color:#096BA6}
      .overlay { margin-left:0px;margin-bottom: 10px;position:absolute;color:white;left:10px;bottom:0px;font-size:28px;text-shadow:3px 3px 3px #000}
      .toolbartabs { top:20px;--paper-tabs-selection-bar-color: #040356;color:var(--text-primary-color);background-color:var(--second-tint-color)}
      .filterbar { text-align:center;font-size:12px;font-family:sans-serif;font-weight:lighter;top:20px;height:40px;background-color:var(--second-tint-color);color:var(--text-primary-color);line-height:40px;padding-left:20px;}
    </style>
    <paper-dialog id="dialog" style="margin:10px;top:56px;" on-iron-overlay-closed="close">
        <div style="position:relative;margin:0px;padding:0px;width:95vw;height:447px;
        background:url([[_getPhoto(selectedItem.Photo)]]);background-size:100% 100%;">
        <span style="text-shadow: 5px 5px 5px #222;line-height:1;position:absolute;padding-left:15px;bottom:100px;color:white;font-size:42px;">[[selectedItem.username]]
        </div>
        <div style="position:relative;padding:15px;background-color: white; margin-top:-80px; height:100px;">
            <div>
                <h1 class="heading" style="color:var(--tint-color)">[[selectedItem.Company]]</h1>
                <p class="title" style="color:var(--tint-color);margin:0px">Sector</p>
                <p style="margin:0px">[[selectedItem.Sectors]]</p>
            </div>
        </div>
        <div class="buttons" style="display:flex;position:relative;border-top:1px solid #d8d5d5;background-color: white;">
            <span style="user-select: none;margin:10px;margin-right:20px;color:var(--tint-color)" dialog-confirm>
            <template is="dom-if" if="{{_unlock(selectedItem)}}">
                <iron-icon style="height:12px;width:12px;" icon="lock"></iron-icon>
            </template>
             Meer informatie</span>
            <span style="user-select: none;margin:10px;color:var(--tint-color)" dialog-dismiss>Sluiten</span>
        </div>
    </paper-dialog>


    <paper-tabs selected="{{selected}}" class="toolbartabs paper-material" elevation="1">
        <paper-tab>Deelnemers</paper-tab>
        <paper-tab>Connecties</paper-tab>
    </paper-tabs>
    <template is="dom-if" if="[[filter]]">
        <div class="paper-material filterbar" elevation="1">
            Huidige zoekcriteria '[[filter]]' <span on-tap="_clearFilter" style="margin-left:20px;"><iron-icon style="height:16px;width:16px;" icon="clear"></iron-icon></span>
        </div>
    </template>
   
    <iron-pages id="pages" selected="{{selected}}">
        <div id="grid">
            <template is="dom-if" if="{{!_result(items.*, filter)}}">
                <div class="empty-recent">
                    Uw zoekopdracht heeft geen resultaten opgeleverd
                </div>
            </template>
            <template is="dom-repeat" id="grid" items="{{items}}" initial-count="20" filter="{{_filter(filter)}}" observe="filter">
            <div on-tap="_showInfo" class="paper-material card" elevation="1" style$="{{_getBackgroundStyle(item.Photo)}}">
                <span class="overlay">[[item.FirstName]]<br/>[[item.LastName]]</span>
            </div>
            </template>
        </div>
        <div id="grid_lastvisited">
            <template is="dom-if" if="{{!_length(itemslastvisited.*)}}">
            <div class="empty-recent">
            U heeft nog geen connecties gemaakt
            </div>
            </template>
            <template is="dom-repeat" id="grid" items="{{itemslastvisited}}" initial-count="20">
            <div on-tap="_showInfo" class="paper-material card" elevation="1" style$="{{_getBackgroundStyle(item.Photo)}}">
                <paper-icon-button icon="delete" on-tap="delete" style="position: absolute;top: 0px;right: 0px;"></paper-icon-button>
                <span class="overlay">[[item.FirstName]]<br/>[[item.LastName]]</span>
            </div>
            </template>
        </div>
    </iron-pages>
   
`;

export class BadgePresentation extends GestureEventListeners(Element) {
    static get template() { return htmlTemplate; }
    static get properties() {
        return {
            items: { type:Array, notify:true, value:[]},
            itemslastvisited: { type:Array, notify:true, value:[]},
            selected: { type:Number, value:0},
            emailaddress: { type:String, notify:true },
            filter: { type:String, value:"", notify:true}
        }
    }

    _getPhoto(img) {
        if (img && img != "n/a") 
            return `background:url(${img}) no-repeat;background-size:100% 100%;`;
        else
            return `background:url(/images/nophoto.jpg) no-repeat;background-size:100% 100%;`;
        
    }
    _getBackgroundStyle(img){
        if (img && img != "n/a") return `background:url(${img}) no-repeat;background-size:100% 100%;`;
        return "background-color:" + ["#43BC84", "#08A195","#0DC4D7"][(Math.floor(Math.random() * 10) % 3)]; 
    }
    _clearFilter(){
        this.filter = "";
        this.$.grid.render();
    }
    _filter(f){
        return (i)=> {
            return this.filter == "" || i.firstname.toLowerCase().indexOf(this.filter.toLowerCase()) != -1 || i.lastname.toLowerCase().indexOf(this.filter.toLowerCase()) != -1;
        }
    }

    _unlock(selectedItem){
        for (var item of this.itemslastvisited){
            if (item.username == selectedItem.username) return false;
        }
        return true;
    }
    
    _length(arr){
        return arr.base.length > 0;
    }
    _result(items, filter){
        var result = [];
        for (var i of this.items) {
            if (this.filter == "" || i.firstname.toLowerCase().indexOf(this.filter.toLowerCase()) != -1 || i.lastname.toLowerCase().indexOf(this.filter.toLowerCase()) != -1) {
                result.push(i); 
            }
        }
        console.log('result', result);
        return result.length;
    }


    _first(name, part){
        if (name.indexOf(' ') > -1)
            return name.split(' ')[part];
        return name;
    }

    connectedCallback(){
        performance.mark("component");
    }
    detached() {
    }

    _back(){
        this.$.pages.selected = 0;
        this.style.overflow = 'scroll';
        this.$.details.classList.remove("shown");
        this.scrollTop = this.oldPos;
    }
    _showInfo(e){
        this.$.grid.style.overflow = 'hidden';
        this.$.grid.style.opacity = 0.2;
        this.$.grid.style.backgroundColor = '#000';
        this.selectedItem = {};
        setTimeout(() => {
            this.selectedItem = e.model.item;
            this.$.dialog.open();
        }, 1);
    }

    close(e){
        if (e.detail.confirmed){
            //this.$.moredialog.open();
            this.dispatchEvent(new CustomEvent('more-info', { detail: { item: this.selectedItem },  bubbles:true, composed:true}));
        } 
        setTimeout(() => {
            this.$.grid.style.overflow = 'scroll';
            this.$.grid.style.backgroundColor = 'white';
            this.$.grid.style.opacity = 1;
        }, 10);

        
    }

    delete(e){
        e.stopPropagation(); 
        console.log('e', e.model.item);
        this.splice('itemslastvisited', this.itemslastvisited.indexOf(e.model.item),1);
    }

}

customElements.define('badge-presentation', BadgePresentation);
