sap.ui.define([
	"Hyogazin/UI5ImproveControlCreation/custom/BaseControl"
], (BaseControl) => {
	"use strict";
	return BaseControl.extend(`Hyogazin.UI5ImproveControlCreation.custom.Text`, {
		metadata : {
			properties: {
				visible: {type: "boolean", defaultValue: true},
                tooltip: {type: "string"},
                text: {type: "string", defaultValue: "", bindable: true}
			},
        },

		renderer(oRm, oControl){
            BaseControl.prototype._renderer.apply(oControl, [oRm]);
        },

        HTMLTemplate(metadata){
			return `
				<span class="Text">
                    ${metadata.properties.text}
				</span>
			`;
		}
	});
});