(window.webpackJsonp=window.webpackJsonp||[]).push([[40,58,85,87],{714:function(e,t,o){"use strict";o.r(t);o(22);var r=o(0),n=o(716),c=r.default.extend({name:"rd-fieldset",components:{LabeledBadge:n.default},props:{legendText:{type:String,default:""},badgeText:{type:String,default:""},legendTooltip:{type:String,default:""},isLocked:{type:Boolean,default:!1}},computed:{lockedTooltip:function(){var e=this.legendTooltip?" <br><br> ".concat(this.legendTooltip):"";return"".concat(this.t("preferences.locked.tooltip")).concat(e)}}}),d=(o(784),o(24)),component=Object(d.a)(c,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("fieldset",{staticClass:"rd-fieldset"},[o("legend",[e._t("legend",(function(){return[o("span",[e._v(e._s(e.legendText))]),e._v(" "),e.badgeText?o("labeled-badge",{attrs:{text:e.badgeText}}):e._e(),e._v(" "),e.isLocked?o("i",{directives:[{name:"tooltip",rawName:"v-tooltip",value:{content:e.lockedTooltip,placement:"right"},expression:"{\n          content: lockedTooltip,\n          placement: 'right'\n        }"}],staticClass:"icon icon-lock"}):e.legendTooltip?o("i",{directives:[{name:"tooltip",rawName:"v-tooltip",value:e.legendTooltip,expression:"legendTooltip"}],staticClass:"icon icon-info icon-lg"}):e._e()]}))],2),e._v(" "),e._t("default",null,{isLocked:e.isLocked})],2)}),[],!1,null,"7cb09b5d",null);t.default=component.exports},715:function(e,t,o){"use strict";o.r(t);var r=o(304),n=o(0).default.extend({name:"rd-checkbox",components:{Checkbox:r.Checkbox},inheritAttrs:!1,props:{isLocked:{type:Boolean,default:!1},tooltip:{type:String,default:null}}}),c=(o(786),o(24)),component=Object(c.a)(n,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"rd-checkbox-container"},[o("checkbox",e._g(e._b({class:{locked:e.isLocked&&!e.$attrs.disabled},attrs:{disabled:e.$attrs.disabled||e.isLocked}},"checkbox",e.$attrs,!1),e.$listeners)),e._v(" "),e._t("after",(function(){return[e.isLocked?o("i",{directives:[{name:"tooltip",rawName:"v-tooltip",value:{content:e.tooltip||e.t("preferences.locked.tooltip"),placement:"right"},expression:"{\n        content: tooltip || t('preferences.locked.tooltip'),\n        placement: 'right',\n      }"}],staticClass:"icon icon-lock"}):e._e()]}))],2)}),[],!1,null,"dcfcefea",null);t.default=component.exports},716:function(e,t,o){"use strict";o.r(t);var r=o(304),n=o(0).default.extend({name:"labeled-badge",components:{BadgeState:r.BadgeState},props:{color:{type:String,default:"bg-darker"},text:{type:String,required:!0}}}),c=(o(782),o(24)),component=Object(c.a)(n,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("badge-state",{staticClass:"badge",attrs:{color:e.color,label:e.text}})}),[],!1,null,"643fa2ac",null);t.default=component.exports},731:function(e,t,o){"use strict";o.r(t);o(26),o(21),o(37),o(9),o(40),o(25),o(41),o(49),o(42),o(43),o(44),o(45),o(55);var r=o(8),n=(o(432),o(304)),c=o(0),d=o(77),l=o(715),f=o(714);function v(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(object);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,o)}return t}function m(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var x=c.default.extend({name:"preferences-container-engine-allowed-images",components:{RdFieldset:f.default,StringList:n.StringList,RdCheckbox:l.default},props:{preferences:{type:Object,required:!0}},computed:m(m({},Object(d.b)("preferences",["isPreferenceLocked"])),{},{patterns:function(){return this.preferences.containerEngine.allowedImages.patterns},isAllowedImagesEnabled:function(){return this.preferences.containerEngine.allowedImages.enabled},isPatternsFieldLocked:function(){return this.isPreferenceLocked("containerEngine.allowedImages.patterns")||!this.isAllowedImagesEnabled},patternsErrorMessages:function(){return{duplicate:this.t("allowedImages.errors.duplicate")}}}),methods:{onChange:function(e,t){this.$store.dispatch("preferences/updatePreferencesData",{property:e,value:t})},onType:function(e){e&&this.setCanApply(e.trim().length>0)},onDuplicate:function(e){e&&this.setCanApply(!1)},setCanApply:function(e){this.$store.dispatch("preferences/setCanApply",e)}}}),h=(o(847),o(849),o(24)),component=Object(h.a)(x,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"container-engine-allowed-images"},[o("rd-fieldset",{attrs:{"data-test":"allowedImages","legend-text":e.t("allowedImages.label"),"badge-text":e.t("prefs.experimental")}},[o("rd-checkbox",{attrs:{label:e.t("allowedImages.enable"),value:e.isAllowedImagesEnabled,"is-locked":e.isPreferenceLocked("containerEngine.allowedImages.enabled")},on:{input:function(t){return e.onChange("containerEngine.allowedImages.enabled",t)}}})],1),e._v(" "),o("string-list",{attrs:{items:e.patterns,"case-sensitive":!1,placeholder:e.t("allowedImages.patterns.placeholder"),readonly:e.isPatternsFieldLocked,"actions-position":"left","error-messages":e.patternsErrorMessages},on:{change:function(t){return e.onChange("containerEngine.allowedImages.patterns",t)},"type:item":function(t){return e.onType(t)},errors:function(t){return e.onDuplicate(t.duplicate)}}})],1)}),[],!1,null,"62349e15",null);t.default=component.exports},779:function(e,t,o){var content=o(783);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(67).default)("375dddca",content,!0,{sourceMap:!1})},780:function(e,t,o){var content=o(785);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(67).default)("4f0be150",content,!0,{sourceMap:!1})},781:function(e,t,o){var content=o(787);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(67).default)("1f4d4142",content,!0,{sourceMap:!1})},782:function(e,t,o){"use strict";o(779)},783:function(e,t,o){var r=o(66)(!1);r.push([e.i,'.clearfix[data-v-643fa2ac]:after,.clearfix[data-v-643fa2ac]:before{content:" ";display:table}.clearfix[data-v-643fa2ac]:after{clear:both}.list-unstyled[data-v-643fa2ac]{margin:0;padding:0;list-style-type:none}.no-select[data-v-643fa2ac]{-webkit-user-select:none;-moz-user-select:none;user-select:none}.no-resize[data-v-643fa2ac]{resize:none}.hand[data-v-643fa2ac]{cursor:pointer;cursor:hand}.fixed[data-v-643fa2ac]{table-layout:fixed}.clip[data-v-643fa2ac]{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.clip[data-v-643fa2ac],.force-wrap[data-v-643fa2ac]{word-wrap:break-word}.force-wrap[data-v-643fa2ac]{white-space:normal}.bordered-section[data-v-643fa2ac]{border-bottom:1px solid var(--border);margin-bottom:20px;padding-bottom:20px}.section-divider[data-v-643fa2ac]{margin-bottom:20px;margin-top:20px}.badge[data-v-643fa2ac]{line-height:normal;letter-spacing:normal;font-size:10px}',""]),e.exports=r},784:function(e,t,o){"use strict";o(780)},785:function(e,t,o){var r=o(66)(!1);r.push([e.i,'.clearfix[data-v-7cb09b5d]:after,.clearfix[data-v-7cb09b5d]:before{content:" ";display:table}.clearfix[data-v-7cb09b5d]:after{clear:both}.list-unstyled[data-v-7cb09b5d]{margin:0;padding:0;list-style-type:none}.no-select[data-v-7cb09b5d]{-webkit-user-select:none;-moz-user-select:none;user-select:none}.no-resize[data-v-7cb09b5d]{resize:none}.hand[data-v-7cb09b5d]{cursor:pointer;cursor:hand}.fixed[data-v-7cb09b5d]{table-layout:fixed}.clip[data-v-7cb09b5d]{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.clip[data-v-7cb09b5d],.force-wrap[data-v-7cb09b5d]{word-wrap:break-word}.force-wrap[data-v-7cb09b5d]{white-space:normal}.bordered-section[data-v-7cb09b5d]{border-bottom:1px solid var(--border);margin-bottom:20px;padding-bottom:20px}.section-divider[data-v-7cb09b5d]{margin-bottom:20px;margin-top:20px}.rd-fieldset[data-v-7cb09b5d]{margin:0;padding:0;border:none}.rd-fieldset legend[data-v-7cb09b5d]{font-size:1rem;color:inherit;line-height:1.5rem;padding-bottom:.5rem}.rd-fieldset legend>*[data-v-7cb09b5d]{margin-right:.25rem}',""]),e.exports=r},786:function(e,t,o){"use strict";o(781)},787:function(e,t,o){var r=o(66)(!1);r.push([e.i,'.clearfix[data-v-dcfcefea]:after,.clearfix[data-v-dcfcefea]:before{content:" ";display:table}.clearfix[data-v-dcfcefea]:after{clear:both}.list-unstyled[data-v-dcfcefea]{margin:0;padding:0;list-style-type:none}.no-select[data-v-dcfcefea]{-webkit-user-select:none;-moz-user-select:none;user-select:none}.no-resize[data-v-dcfcefea]{resize:none}.hand[data-v-dcfcefea]{cursor:pointer;cursor:hand}.fixed[data-v-dcfcefea]{table-layout:fixed}.clip[data-v-dcfcefea]{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.clip[data-v-dcfcefea],.force-wrap[data-v-dcfcefea]{word-wrap:break-word}.force-wrap[data-v-dcfcefea]{white-space:normal}.bordered-section[data-v-dcfcefea]{border-bottom:1px solid var(--border);margin-bottom:20px;padding-bottom:20px}.section-divider[data-v-dcfcefea]{margin-bottom:20px;margin-top:20px}.locked[data-v-dcfcefea] .checkbox-container span.checkbox-custom{background-color:var(--checkbox-locked-bg);border-color:var(--checkbox-locked-border)}.locked[data-v-dcfcefea] .checkbox-container span.checkbox-custom:after{border-color:var(--checkbox-tick-locked)}',""]),e.exports=r},821:function(e,t,o){var content=o(848);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(67).default)("47861471",content,!0,{sourceMap:!1})},822:function(e,t,o){var content=o(850);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,o(67).default)("6919f427",content,!0,{sourceMap:!1})},847:function(e,t,o){"use strict";o(821)},848:function(e,t,o){var r=o(66)(!1);r.push([e.i,'.clearfix[data-v-62349e15]:after,.clearfix[data-v-62349e15]:before{content:" ";display:table}.clearfix[data-v-62349e15]:after{clear:both}.list-unstyled[data-v-62349e15]{margin:0;padding:0;list-style-type:none}.no-select[data-v-62349e15]{-webkit-user-select:none;-moz-user-select:none;user-select:none}.no-resize[data-v-62349e15]{resize:none}.hand[data-v-62349e15]{cursor:pointer;cursor:hand}.fixed[data-v-62349e15]{table-layout:fixed}.clip[data-v-62349e15]{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.clip[data-v-62349e15],.force-wrap[data-v-62349e15]{word-wrap:break-word}.force-wrap[data-v-62349e15]{white-space:normal}.bordered-section[data-v-62349e15]{border-bottom:1px solid var(--border);margin-bottom:20px;padding-bottom:20px}.section-divider[data-v-62349e15]{margin-bottom:20px;margin-top:20px}.container-engine-allowed-images[data-v-62349e15]{display:flex;flex-direction:column;grid-gap:1rem;gap:1rem}.container-engine-allowed-images .string-list[data-v-62349e15]{height:220px}',""]),e.exports=r},849:function(e,t,o){"use strict";o(822)},850:function(e,t,o){var r=o(66)(!1);r.push([e.i,'.clearfix:after,.clearfix:before{content:" ";display:table}.clearfix:after{clear:both}.list-unstyled{margin:0;padding:0;list-style-type:none}.no-select{-webkit-user-select:none;-moz-user-select:none;user-select:none}.no-resize{resize:none}.hand{cursor:pointer;cursor:hand}.fixed{table-layout:fixed}.clip{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.clip,.force-wrap{word-wrap:break-word}.force-wrap{white-space:normal}.bordered-section{border-bottom:1px solid var(--border);margin-bottom:20px;padding-bottom:20px}.section-divider{margin-bottom:20px;margin-top:20px}.string-list .string-list-box .item .label{white-space:nowrap}',""]),e.exports=r}}]);