(window.webpackJsonp=window.webpackJsonp||[]).push([[78],{745:function(e,t,r){"use strict";r.r(t);r(26),r(21),r(37),r(9),r(40),r(25),r(41),r(49),r(42),r(43),r(44),r(45),r(55);var n=r(8),o=r(0),c=r(77);function d(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(t){Object(n.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var f={reset:"preferences.actions.banner.reset",restart:"preferences.actions.banner.restart",error:"preferences.actions.banner.error"},v=o.default.extend({name:"preferences-alert",computed:l(l({},Object(c.d)("preferences",["severities","preferencesError"])),{},{severity:function(){return this.severities.error?"error":this.severities.reset?"reset":this.severities.restart?"restart":void 0},alert:function(){return this.severity?f[this.severity]:""},alertText:function(){return this.preferencesError?this.preferencesError:this.alert?this.t(this.alert,{},!0):null}})}),h=(r(887),r(24)),component=Object(h.a)(v,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"alert"},[e.alert?r("span",{staticClass:"alert-text"},[e._v("\n    "+e._s(e.alertText)+"\n  ")]):e._e()])}),[],!1,null,"e41c3ada",null);t.default=component.exports},837:function(e,t,r){var content=r(888);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(67).default)("3535a3c2",content,!0,{sourceMap:!1})},887:function(e,t,r){"use strict";r(837)},888:function(e,t,r){var n=r(66)(!1);n.push([e.i,'.clearfix[data-v-e41c3ada]:after,.clearfix[data-v-e41c3ada]:before{content:" ";display:table}.clearfix[data-v-e41c3ada]:after{clear:both}.list-unstyled[data-v-e41c3ada]{margin:0;padding:0;list-style-type:none}.no-select[data-v-e41c3ada]{-webkit-user-select:none;-moz-user-select:none;user-select:none}.no-resize[data-v-e41c3ada]{resize:none}.hand[data-v-e41c3ada]{cursor:pointer;cursor:hand}.fixed[data-v-e41c3ada]{table-layout:fixed}.clip[data-v-e41c3ada]{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.clip[data-v-e41c3ada],.force-wrap[data-v-e41c3ada]{word-wrap:break-word}.force-wrap[data-v-e41c3ada]{white-space:normal}.bordered-section[data-v-e41c3ada]{border-bottom:1px solid var(--border);margin-bottom:20px;padding-bottom:20px}.section-divider[data-v-e41c3ada]{margin-bottom:20px;margin-top:20px}.alert .alert-text[data-v-e41c3ada]{color:var(--body-text)}',""]),e.exports=n}}]);