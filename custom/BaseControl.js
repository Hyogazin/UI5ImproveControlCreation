sap.ui.define([
	"sap/ui/core/Control"
], (Control) => {
	"use strict";
	return Control.extend(`Hyogazin.UI5ImproveControlCreation.custom.BaseControl`, {
		metadata: {
			properties: {},
			events: {},
			aggregations: {content: {}},
			defaultAggregation: "content"
        },

		renderer(oRm, oControl){
			oControl._renderer(oRm);
        },

		onAfterRendering: function(){
			if(!this._bindedElements) return;
			
			let srcElement = this.getDomRef();
			if(!srcElement) return;

			for(let id in this._bindedElements){
				let bindedElement = this._bindedElements[id];
				let htmlElement = srcElement.id === id ? srcElement : srcElement.querySelector("#"+id);
				if(!bindedElement || !htmlElement) continue;

				let hasChangeableAttribute = false;
				for(let attribute in bindedElement.properties){
					if(attribute === "style" || attribute === "class") continue;
					hasChangeableAttribute = true;
					break;
				}
				if(hasChangeableAttribute){
					htmlElement.addEventListener("change", (e) => {
						let element = e.currentTarget;
						for(let attribute in bindedElement.properties){
							if(attribute === "style" || attribute === "class") continue;
							let bindedProperty = bindedElement.properties[attribute];
							this.setProperty(bindedProperty.propertyName, element[attribute], true);
						}
					});
				}
				for(let attribute in bindedElement.events){
					let bindedEvent = bindedElement.events[attribute];
					htmlElement.addEventListener(bindedEvent.htmlEventName, (e) => {
						this.fireEvent(bindedEvent.eventName, {value: e.currentTarget.value});
					});
				}
			}
		},

		_renderer(oRm){
			this._bindedElements = {};
			let metadata = this._getMetadataPaths();
			let html = this.HTMLTemplate(metadata);
			this._validateHTML(metadata, html);
			let element = this._transformHTMLIntoDOMElement(html);
			this._renderHTMLElement(oRm, metadata, element, this.getId());
		},

		_getMetadataPaths(){
			let result = {
				properties: {},
				events: {},
				aggregations: {},
			};

			let metadata = this.getMetadata();

			let properties = metadata.getProperties();
			for(let key of Object.keys(properties)) result.properties[key] = `{{properties.${key}}}`;

			let events = metadata.getEvents();
			for(let key of Object.keys(events)) result.events[key] = `{{events.${key}}}`;

			let aggregations = metadata.getAggregations();
			for(let key of Object.keys(aggregations)) result.aggregations[key] = `{{aggregations.${key}}}`;

			return result;
		},
		
		_validateHTML(metadata, html){
			for(let key in metadata.aggregations){
				let value = metadata.aggregations[key];
				if(value == "") continue;
				let splits = html.split(value);
				if(splits.length-1 <= 1) continue;
				throw new Error("Aggregation cannot be called more than once");
			}
		},

		_transformHTMLIntoDOMElement(html){
			let temp = document.createElement("div");
			temp.innerHTML = html;
			let element = temp.children[0];
			return element;
		},

		_prepareArrayToAddEventsAfterRendering(metadata, element, attribute, id){
			let attributeValue = element.getAttribute(attribute);
			let eventName = null;
			for(let key in metadata.events){
				let eventPath = metadata.events[key];
				if(!attributeValue.includes(eventPath)) continue;
				eventName = key;
				break;
			}
			if(!eventName) return;

			let htmlEventName = attribute.substr(2);
			if(!this._bindedElements[id]) this._bindedElements[id] = {id: id, events: [], properties: []};
			this._bindedElements[id].events[attribute] = {
				htmlEventName: htmlEventName,
				eventName: eventName
			};
		},

		_assignValuesByPath(metadata, element, attribute, id){
			let attributeValue = element.getAttribute(attribute);
			let property = null;
			for(let key in metadata.properties){
				let propertyPath = metadata.properties[key];
				if(!attributeValue.includes(propertyPath)) continue;
				property = key;
				let propertyValue = this.getProperty(property)
				if(propertyValue !== null) attributeValue = attributeValue.replace(propertyPath, propertyValue);
			}
			element.setAttribute(attribute, attributeValue);
			
			if(!property) return attributeValue;;
			if(!this._bindedElements[id]) this._bindedElements[id] = {id: id, events: [], properties: []};
			this._bindedElements[id].properties[attribute] = {
				propertyName: property,
				attributeName: attribute,
			};
			return attributeValue;
		},

		_renderHTMLText(oRm, metadata, text){
			for(let key in metadata.properties){
				let path = metadata.properties[key];

				let index = text.indexOf(path);
				if(index < 0) continue;

				let property = this.getProperty(key);
				if(property === null) continue;

				text = text.replace(new RegExp(path, "g"), property);
			}
			for(let key in metadata.aggregations){
				let path = metadata.aggregations[key];

				let index = text.indexOf(path);
				if(index < 0) continue;

				let aggregation = this.getAggregation(key);
				if(!aggregation) continue;

				if(index > 0){
					oRm.text(text.substr(0, index));
					text = text.substr(index).trim();
				}

				text = text.replace(path, "");
				for(let oChild of aggregation) oRm.renderControl(oChild);
			}
			if(text) oRm.text(text);
		},

		_renderHTMLElement(oRm, metadata, element, id){
			let tagName = element.tagName.toLowerCase();
			oRm.openStart(tagName, id);

			let attributes = element.getAttributeNames();
			for(let attribute of attributes){
				let isEvent = attribute.startsWith("on");
				if(isEvent){
					this._prepareArrayToAddEventsAfterRendering(metadata, element, attribute, id);
					element.removeAttribute(attribute);
				} else {
					let attributeValue = this._assignValuesByPath(metadata, element, attribute, id);
					oRm.attr(attribute, attributeValue);
				}
			}
			oRm.openEnd();

			let suffixCount = 0;
			for(let node of element.childNodes){
				if(node.nodeType === Node.TEXT_NODE){
					let text = node.nodeValue.trim();
					this._renderHTMLText(oRm, metadata, text);
				} else {
					this._renderHTMLElement(oRm, metadata, node, `${id}-inner${suffixCount}`);
					suffixCount++;
				}
			}

			oRm.close(tagName);
		},
	});
});