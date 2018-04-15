import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement} from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
<style>
.container { overflow:scroll; top:64px;height:100vh;width:100vw;margin-top:0px;position:absolute;background-color:var(--tint-color);}
.newsitem  {     display: flex;
    position:relative;
    flex-flow: row;
    font-size:3vw;
    font-family: sans-serif;
    margin: 10px;
    justify-content:center;
    align-items:center;
    color:var(--tint-color);
    border: 1px solid black;
    background-color: white;
    height: 100px;}
.quote {margin-left:10px;margin-bottom:15px;font-style: italic;} 
.photo {
    margin:5px;
}
.source { color:#9a9a9a;align-self: flex-end;margin-right: 20px;margin-top:5px;font-size:12px;}
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
    </div>
`;

export class BadgeNews extends PolymerElement {
    static get properties(){
        return {
            items:{
                type:Array
            }
        }
    }
    static get template() {
        return htmlTemplate;
    }
    _formatTime(time){
        return new Date(time).toLocaleString(); 
    }
    sort(a, b){
        return parseInt(b.created) - parseInt(a.created);
    }
}

customElements.define('badge-news', BadgeNews);