sap.ui.define([
	"Hyogazin/UI5ImproveControlCreation/custom/BaseControl"
], (BaseControl) => {
	"use strict";
	return BaseControl.extend(`Hyogazin.UI5ImproveControlCreation.custom.Input`, {
		metadata : {
			properties: {
				visible: {type: "boolean", defaultValue: true},
                tooltip: {type: "string"},
                value: {type: "string", defaultValue: "", bindable: true},
                width: {type: "string"}
			},
            events: {
                change: {}
            }
        },

		renderer(oRm, oControl) {
            BaseControl.prototype._renderer.apply(oControl, [oRm]);
        },

        HTMLTemplate(metadata){
			let style = "";
			style += `width: ${metadata.properties.width};`;
			style += `padding: ${metadata.properties.padding};`;
			return `
				<input class="Input" value="${metadata.properties.value}" style="${style}" onchange="${metadata.events.change}">
				</input>
			`;
		}
	});
});