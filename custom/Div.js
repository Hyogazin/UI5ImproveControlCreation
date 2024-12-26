sap.ui.define([
	"Hyogazin/UI5ImproveControlCreation/custom/BaseControl"
], (BaseControl) => {
	"use strict";
	return BaseControl.extend(`Hyogazin.UI5ImproveControlCreation.custom.Div`, {
		metadata : {
			properties: {
				direction: {type: "string", defaultValue: "row"},
				gap: {type: "string", defaultValue: "10px"},
				padding: {type: "string"},
				alignItems: {type: "string", defaultValue: "normal"},
				justifyContent: {type: "string", defaultValue: "normal"},
			},
			aggregations : {
				content : {type : "sap.ui.core.Control", multiple: true, singularName: "content"}
			},
			defaultAggregation: "content"
        },

		renderer(oRm, oControl) {
			BaseControl.prototype._renderer.apply(oControl, [oRm]);
        },

		HTMLTemplate(metadata){
			let style = "";
			style +=`flex-direction: ${metadata.properties.flexDirection};`;
			style +=`gap: ${metadata.properties.gap};`;
			style +=`padding: ${metadata.properties.padding};`;
			style +=`align-items: ${metadata.properties.alignItems};`;
			style +=`justify-content: ${metadata.properties.justifyContent};`;
			return `
				<div class="Div" style="${style}">
					${metadata.aggregations.content}
				</div>
			`;
		}
	});
});