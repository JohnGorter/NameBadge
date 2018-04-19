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
        #grid { display:flex;flex-flow:wrap;margin-left:2px; margin-top:25px;height:74vh;align-items: flex-start;
            align-content: flex-start;}
        #grid_lastvisited { display:flex;flex-flow:wrap;margin-left:2px; margin-top:25px;height:74vh;align-items: flex-start;
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
      
     

      .empty-recent {display: flex; align-items: center; justify-content: center; width: 100%; height: 200px; font-family: roboto; color: #343434; }
      .hidden { display:none;}
      .card { border-radius:3px;height:45vw; width:45vw;margin-bottom:20px;margin-left:10px;background-color:#096BA6;display: flex; justify-content: flex-start;}
      .overlay { margin-left:0px;margin-bottom: 10px;position:absolute;color:white;left:10px;bottom:0px;font-size:5vw;text-shadow:3px 3px 3px #000}
      .toolbartabs { top:20px;--paper-tabs-selection-bar-color: #040356;color:var(--text-primary-color);background-color:var(--second-tint-color)}
      .filterbar { text-align:center;font-size:12px;font-family:sans-serif;font-weight:lighter;top:20px;height:40px;background-color:var(--second-tint-color);color:var(--text-primary-color);line-height:40px;padding-left:20px;}
      :host { width:100vw;background-color:#efefef;top:44px;position:fixed;}
      </style>
    


    <paper-tabs selected="{{selected}}" class="toolbartabs paper-material" elevation="1">
        <paper-tab>Deelnemers</paper-tab>
        <paper-tab>Connecties</paper-tab>
    </paper-tabs>
    <template is="dom-if" if="[[_isCustomFilter(filter)]]">
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
            <template is="dom-repeat" id="grid" items="{{items}}" initial-count="20" filter="{{_filter(filter)}}" sort="_sort" observe="filter">
            <div on-tap="_showInfo" class="paper-material card" elevation="1" style$="{{_getBackgroundStyle(item.Photo, item.CompanyLogo)}}">
            <template is="dom-if" if="[[_currentUser(item)]]">
            <iron-icon style="margin:5px;color:yellow;width:30px;height:30px;justify-self:flex-end" icon="verified-user"></iron-icon>
            </template>
            <span class="overlay">[[_formatFirstName(item.FirstName)]]<br/>[[_formatLastName(item.LastName)]]</span>
            </div>
            </template>
             <div style="height:100px;width:80vw;">  
            </div>
        </div>
        <div id="grid_lastvisited">
            <template is="dom-if" if="{{!_length(itemslastvisited.*)}}">
            <div class="empty-recent">
            U heeft nog geen connecties gemaakt
            </div>
            </template>
            <template is="dom-repeat" id="grid" items="{{itemslastvisited}}" initial-count="20">
            <div on-tap="_showInfo" class="paper-material card" elevation="1" style$="{{_getBackgroundStyle(item.Photo, item.CompanyLogo)}}"> 
            <template is="dom-if" if="[[_currentUser(item)]]">
            <iron-icon style="margin:5px;color:yellow;width:30px;height:30px;justify-self:flex-end" icon="verified-user"></iron-icon>
            </template>
                <paper-icon-button icon="delete" on-tap="delete" style="position: absolute;top: 0px;right: 0px;"></paper-icon-button>
                <span class="overlay">[[_formatFirstName(item.FirstName)]]<br/>[[_formatLastName(item.LastName)]]</span>
            </div>
            </template>
            <div style="height:100px;width:80vw;">  
            </div>
        </div>
    </iron-pages>
   
`;

export class BadgePresentation extends GestureEventListeners(Element) {
    static get template() { return htmlTemplate; }
    static get properties() {
        return {
            items: { type:Array, notify:true, value:[]},
            itemslastvisited: { type:Array, notify:true, value:[]},
            selected: { type:Number, value:0, notify:true},
            user: { type:String, notify:true },
            filter: { type:String, value:"", notify:true}
        }
    }

   
    _getBackgroundStyle(img, logo){
        if (img && img != "n/a") return `background:url(${img}) no-repeat;background-size:cover;overflow:hidden;`;
        if (logo && logo != "n/a") return `background:url(${logo}) no-repeat;background-size:cover;overflow:hidden;`;
        return "background-color:" + ["#43BC84", "#08A195","#0DC4D7"][(Math.floor(Math.random() * 10) % 3)]; 
    }

    _currentUser(item){
        let user = localStorage["username"];
        if (item.Username == undefined) { 
            let message = "Error: no username for user " + item.FirstName  + " " + item.LastName;
            this.dispatchEvent(new CustomEvent("error", { detail:message, composed:true, bubbles:true}));
            // console.log("Error: no email for user " + item.FirstName  + " " + item.LastName); return false ;
        }
        return  user == item.Username;
    }
 
    _clearFilter(){
        this.filter = '["a","b","c","d"]';
        this.$.grid.render();
    }

    _isJSON(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return false;
        }
    }

    _filter(f){
        return (i)=> {
            if (this.filter == "") return true;
            let activefilter = this._isJSON(this.filter); 
            if (activefilter){
                return activefilter.indexOf(i.LastName[0].toLowerCase()) != -1;
            } else {
                // filter on name
                return i.Username.toLowerCase().indexOf(this.filter.toLowerCase()) != -1;
            }
        }
    }
    _formatFirstName(firstname){
        return firstname;
      //  return firstname[0].toUpperCase() + firstname.substring(1).toLowerCase();
     }


     _isCustomFilter(filter){
        return !this._isJSON(filter) && filter != "";
     }

     _formatLastName(lastname){
          return lastname;
    }
    
    _sort(a, b) {
        var x =  a.LastName.toLowerCase();
        var y = b.LastName.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    }

    _length(arr){
        return arr.base.length > 0;
    }
    _result(items, filter){
        var result = [];
        for (var i of this.items) {

            if (this.filter == "") result.push(i); 
            let activefilter = this._isJSON(this.filter); 
            if (Array.isArray(activefilter)){
                if (activefilter.indexOf(i.LastName[0].toLowerCase()) != -1)
                    result.push(i); 
            } else if (i.Username.toLowerCase().indexOf(this.filter.toLowerCase()) != -1 ) {
                result.push(i); 
            }
        }
    //    console.log('result', result);
        return result.length;
    }


    _first(name, part){
        if (name.indexOf(' ') > -1)
            return name.split(' ')[part];
        return name;
    }

    

    _back(){
        this.$.pages.selected = 0;
        this.style.overflow = 'scroll';
        this.$.details.classList.remove("shown");
        this.scrollTop = this.oldPos;
    }
    _showInfo(e){
        let unlock = true;
        for (var item of this.itemslastvisited){
            if (item.Username == e.model.item.Username) {
              unlock = false;
              break;
            }
        }
        this.dispatchEvent(new CustomEvent('basic-info', { detail: { item: e.model.item, unlock: unlock },  bubbles:true, composed:true}));
    }

    
    delete(e){
        e.stopPropagation(); 
        console.log('e', e.model.item);
        this.splice('itemslastvisited', this.itemslastvisited.indexOf(e.model.item),1);
    }

}

customElements.define('badge-presentation', BadgePresentation);
