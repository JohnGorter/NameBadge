import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement} from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
<style>
.container { overflow:scroll; top:64px;height:85vh;width:100vw;margin-top:0px;position:fixed;background-color:#f5f5f5;}
.newsitem  {     display: flex;
    position:relative;
    flex-flow: row;
    font-size:3.2vw;
    font-family: sans-serif;
    margin: 10px;
    justify-content:center;
    align-items:center;
    color:var(--tint-color);
    border: 1px solid white;
    border-right: 1px solid silver;
    border-bottom: 1px solid silver;
    background-color: white;
    height: 100px;}
.quote {margin-left:10px;margin-right:10px;margin-bottom:15px;font-style: italic;} 
.photo {
    margin:5px;
}
.source { color:#9a9a9a;align-self: flex-end;margin-right: 10px;margin-top:5px;font-size:2.5vw;}
</style>
    <div class="container">
        <template is="dom-repeat" items="{{items}}" sort="[[sort]]">
             <div class="newsitem">
                <template is="dom-if" if="[[item.photo]]">
                <div class="photo"><img src="[[item.photo]]" height="80"></img></div>
                </template>
                <div style="display:flex;flex-flow:column;width:100%">
                    <span class="quote">"[[item.title]]"</span>
                             <div class="source"  style="margin-left:20px;">[[_formatTime(item.created)]]</div>
                             <div class="source" style="flex:1;text-align: right;">@[[item.user]]</div>
                </div>
            </div>
        </template>
        <div style="height:100px;"></div>
    </div>
`;

export class BadgeNews extends PolymerElement {
    static get observers() { return ['_updatedItems(items.*)'];}
    static get properties(){
        return {
            page: { type:Number, observer:'_pagechange'},
            items:{ type:Array },
            activated:{ type:Boolean, value:false },
            icon: { type:String, value:'twitter.svg', notify:true}
        }
    }
    static get template() {
        return htmlTemplate;
    }

    _pagechange(){
        if (this.page == 3) this._activate(); 
        else this._deactivate(); 
        this.oldpage = this.page;
    }

    _deactivate() {
        this.lastactivated = new Date();
        this.activated = false; 
    }
    _activate(){
        this.activated = true;
        this.icon = "twitter.svg";
    }
    
    _updatedItems() {
        this.updatetime = new Date(); 
        let msdiff = this.updatetime - this.lastactivated;
        let seconds = msdiff / 1000;
        if (!this.activated && seconds > 10)
            this.icon = "twitter_new.svg";
    }

    _formatTime(time){
        return new Date(time).toLocaleString(); 
    }

    sort(a, b){
        return parseInt(b.created) - parseInt(a.created);
    }
}

customElements.define('badge-news', BadgeNews);