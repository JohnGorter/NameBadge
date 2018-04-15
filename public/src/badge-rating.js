import '/node_modules/@polymer/polymer/polymer.js';
import { Element as PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js'

const html = String.raw;
const htmlTemplate = html`
        <style>
            :host { margin-top:7px;}
        iron-icon { height:20px;width:20px;}
        iron-icon[active] {  color: var(--tint-color); }
        iron-icon:not([active]) { color: var(--paper-rating-inactive-color, --disabled-text-color); }
        .labels { display:none;font-family:sans-serif;font-size:10px;font-weight:lighter;}
        :host([labels]) .labels { display:inline;line-height:25px;}
        iron-icon {  @apply(--paper-rating-icon); }
        </style>
            <b class="labels">Slecht  </b>
            <template is="dom-repeat" items="[[_stars]]">
                <iron-icon icon="[[icon]]" active$="[[item]]" data-index$="[[index]]" on-tap="_updateRating"></iron-icon>
            </template>
            <b class="labels">  Uitstekend</b>
        
       `;

export class BadgeRating extends PolymerElement {
    static get template() {
        return htmlTemplate;
    }

    static get properties() {
        return {
                /**
                 * Rating value.
                 */
                rating: {
                    type: Number,
                    notify: true
                },
                /**
                 * Rating maximum value - this will determine amount of 'stars'.
                 */
                max: {
                    type: Number,
                    value: 5
                },
                /**
                 * Name of iron-icon to use.
                 */
                icon: {
                    type: String,
                    value: 'star'
                },
                /**
                 * Disable it for read only mode.
                 */
                disabled: {
                    type: Boolean,
                    value: false,
                    reflectToAttribute: true
                },
                _stars: {
                    type: Array,
                    computed: '_computeStars(max,rating)'
                }
            }
    }

    _computeStars(max, rating) {
        var result = Array.apply(null, Array(max)).map(Boolean.prototype.valueOf, false);
        for (var i = 0; i < Math.round(rating); i++) {
             result[i] = true;
        }
        return result;
    }
    _updateRating(e) {
        if (this.disabled) return;
        this.rating = Number(e.target.dataset['index']) + 1;
       // console.log(this.rating);
    }
}

customElements.define('badge-rating', BadgeRating);