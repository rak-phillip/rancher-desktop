(window.webpackJsonp=window.webpackJsonp||[]).push([[65],{765:function(o,t,r){"use strict";r.r(t);var n={name:"ActionDropdown",props:{size:{type:String,default:""},dualAction:{type:Boolean,default:!0},disableButton:{type:Boolean,default:!1}},computed:{buttonSize:function(){var o;switch(this.size){case"":o="btn";break;case"xs":o="btn btn-xs";break;case"sm":o="btn btn-sm";break;case"lg":o="btn btn-lg"}return o}},methods:{hasSlot:function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"default";return!!this.$slots[o]||!!this.$scopedSlots[o]},togglePopover:function(){}}},e=n,d=(r(908),r(24)),component=Object(d.a)(e,(function(){var o,t=this,r=t.$createElement,n=t._self._c||r;return n("div",{staticClass:"dropdown-button-group"},[n("div",{staticClass:"dropdown-button bg-primary btn-role-primary",class:(o={"one-action":!t.dualAction},o[t.buttonSize]=!0,o.disabled=t.disableButton,o)},[n("v-popover",{attrs:{placement:"bottom",container:!1,disabled:t.disableButton,"popper-options":{modifiers:{flip:{enabled:!1}}}},scopedSlots:t._u([{key:"popover",fn:function(){return[t._t("popover-content")]},proxy:!0}],null,!0)},[t._t("button-content",(function(){return[n("button",{ref:"popoverButton",staticClass:"icon-container bg-primary no-left-border-radius",class:t.buttonSize,attrs:{disabled:t.disableButton,type:"button"}},[t._v("\n          Button "),n("i",{staticClass:"icon icon-chevron-down"})])]}),{buttonSize:t.buttonSize})],2)],1)])}),[],!1,null,null,null);t.default=component.exports},863:function(o,t,r){var content=r(909);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[o.i,content,""]]),content.locals&&(o.exports=content.locals);(0,r(67).default)("6828fc1e",content,!0,{sourceMap:!1})},908:function(o,t,r){"use strict";r(863)},909:function(o,t,r){var n=r(66)(!1);n.push([o.i,'.clearfix:after,.clearfix:before{content:" ";display:table}.clearfix:after{clear:both}.list-unstyled{margin:0;padding:0;list-style-type:none}.no-select{-webkit-user-select:none;-moz-user-select:none;user-select:none}.no-resize{resize:none}.hand{cursor:pointer;cursor:hand}.fixed{table-layout:fixed}.clip{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.clip,.force-wrap{word-wrap:break-word}.force-wrap{white-space:normal}.bordered-section{border-bottom:1px solid var(--border);margin-bottom:20px;padding-bottom:20px}.section-divider{margin-bottom:20px;margin-top:20px}.dropdown-button-group .no-left-border-radius{border-top-left-radius:0;border-bottom-left-radius:0}.dropdown-button-group .no-right-border-radius{border-top-right-radius:0;border-bottom-right-radius:0}.dropdown-button-group .btn{line-height:normal;border:0}.dropdown-button-group .btn-group-xs>.btn,.dropdown-button-group .btn-xs,.dropdown-button-group .btn-xs .btn-label{padding:2px 3px;font-size:13px}.dropdown-button-group .v-popover .text-right{margin-top:5px}.dropdown-button-group .v-popover .trigger{height:100%}.dropdown-button-group .v-popover .trigger .icon-container{height:100%;padding:10px}.dropdown-button-group .v-popover .trigger .icon-container i{transform:scale(1)}.dropdown-button-group .v-popover .trigger .icon-container.btn-xs{padding:2px 4px 4px}.dropdown-button-group .v-popover .trigger .icon-container.btn-sm{padding:10px}.dropdown-button-group .v-popover .trigger .icon-container.btn-lg{padding:18px 10px 10px}.dropdown-button-group .v-popover .trigger .icon-container:focus{outline-style:none;box-shadow:none;border-color:transparent}.dropdown-button-group .dropdown-button{background:var(--tooltip-bg);color:var(--link-text);padding:0;display:inline-flex}.dropdown-button-group .dropdown-button .wrapper-content button{border-right:0}.dropdown-button-group .dropdown-button .icon-chevron-down,.dropdown-button-group .dropdown-button>*{color:var(--primary);background-color:transparent}.dropdown-button-group .dropdown-button.bg-primary:hover{background:var(--accent-btn-hover)}.dropdown-button-group .dropdown-button.one-action{position:relative}.dropdown-button-group .dropdown-button.one-action>.btn{padding:15px 35px 15px 15px}.dropdown-button-group .dropdown-button.one-action .v-popover .trigger{position:absolute;top:0;right:0;left:0;bottom:0}.dropdown-button-group .dropdown-button.one-action .v-popover .trigger BUTTON{position:absolute;right:0}.dropdown-button-group .popover{border:none}.dropdown-button-group .tooltip{margin-top:0}.dropdown-button-group .tooltip[x-placement^=bottom] .tooltip-arrow{border-bottom-color:var(--dropdown-border)}.dropdown-button-group .tooltip[x-placement^=bottom] .tooltip-arrow:after{border-bottom-color:var(--dropdown-bg)}.dropdown-button-group .tooltip .tooltip-inner{color:var(--dropdown-text);background-color:var(--dropdown-bg);border:1px solid var(--dropdown-border);padding:0;text-align:left}.dropdown-button-group .tooltip .tooltip-inner LI{padding:10px}.dropdown-button-group .tooltip .tooltip-inner LI.divider{padding-top:0;padding-bottom:0}.dropdown-button-group .tooltip .tooltip-inner LI.divider>.divider-inner{padding:0;border-bottom:1px solid var(--dropdown-divider);width:125%;margin:0 auto}.dropdown-button-group .tooltip .tooltip-inner LI:not(.divider):hover{background-color:var(--dropdown-hover-bg);color:var(--dropdown-hover-text);cursor:pointer}.dropdown-button-group .user-info{border-bottom:1px solid var(--border);display:block}',""]),o.exports=n}}]);