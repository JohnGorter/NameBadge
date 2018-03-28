import '/node_modules/@polymer/polymer/polymer.js'
import { Element as PolymerElement} from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
<style>
.container { overflow:scroll; top:64px;height:100vh;width:100vw;margin-top:0px;position:absolute;background-color:var(--general-background);}
.newsitem  { display: flex;
    flex-flow: column;
    margin: 10px;
    justify-content:center;
    align-items:center;
    color:var(--tint-color);
    background-color: white;
    height: 100px;
    box-shadow: var(--paper-material-elevation-1_-_box-shadow);
}
.quote {font-style: italic;} 
.source { color:#9a9a9a;align-self: flex-end;margin-right: 20px;margin-top:15px;font-size:12px;}
</style>
    <div class="container">
        <template is="dom-repeat" items="{{items}}" sort="[[sort]]">
             <div class="newsitem"><span class="quote">"[[item.title]]"</span>
             <div style="display:flex;width:100%">
                             <div class="source"  style="margin-left:20px;color:white;">[[item.created]]</div>
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
    sort(a, b){
        return parseInt(a.created) < parseInt(b.created);
    }
}

customElements.define('badge-news', BadgeNews);