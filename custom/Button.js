sap.ui.define([
	"Hyogazin/UI5ImproveControlCreation/custom/BaseControl"
], (BaseControl) => {
	"use strict";
	return BaseControl.extend(`Hyogazin.UI5ImproveControlCreation.custom.Button`, {
		metadata : {
			properties: {
				visible: {type: "boolean", defaultValue: true},
                tooltip: {type: "string"},
                text: {type: "string", defaultValue: "", bindable: true}
			},
            events: {
                press: {}
            }
        },

		renderer(oRm, oControl){
			BaseControl.prototype._renderer.apply(oControl, [oRm]);
        },

        HTMLTemplate(metadata){
            return `
                <button class="Button" onclick="${metadata.events.press}">
                    ${metadata.properties.text}
				</button>
            `;
        }
	});
});