sap.ui.define([
	"Hyogazin/UI5ImproveControlCreation/custom/BaseControl"
], (BaseControl) => {
	"use strict";
	return BaseControl.extend(`Hyogazin.UI5ImproveControlCreation.custom.Panel`, {
		metadata : {
			properties: {},
			events: {},
			aggregations: {
				header: {type: "sap.ui.core.Control"},
				content: {type: "sap.ui.core.Control", multiple: true, singularName: "content"},
				footer: {type: "sap.ui.core.Control"},
			},
			defaultAggregation: "content"
        },

		renderer(oRm, oControl){
			BaseControl.prototype._renderer.apply(oControl, [oRm]);
        },
		
		HTMLTemplate(metadata){
			return `
				<div class="Panel" style="padding: ${metadata.properties.padding}">
					<div>
						${metadata.aggregations.header}
					</div>
					<div>
						${metadata.aggregations.content}
					</div>
					<div>
						${metadata.aggregations.footer}
					</div>
				</div>
			`;
		}
	});
});