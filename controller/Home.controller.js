sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
 ], (Controller, JSONModel) => {
    "use strict";
    return Controller.extend("Hyogazin.UI5ImproveControlCreation.controller.Home", {
        onInit() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("home").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched() {
            this.getView().setModel(new JSONModel({text: "abc"}), "data");
		},
    });
});