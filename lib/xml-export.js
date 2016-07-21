define(function (require, exports) {
    "use strict";

    let RestRequest = function (xml, selected) {
        this.selected = selected;
        this.doc = xml.ownerDocument.createElement('RestClientRequest');
        xml.appendChild(this.doc);
        this.handler = xml;
        console.log(selected);
        this.initialize();
    };
    RestRequest.prototype = {


        initialize: function () {
            this.addOption("biscuits", []);
            this.addOption("httpMethod", this.selected.method);
            this.addOption("urlBase", this.selected.url);
            this.addOption("urlPath", "");
            this.addOption("headers", this.generateHeadersList(this.selected.requestHeaders.headers));
            this.addOption('parameters',[]);
            this.addOption('parametersEnabled', 'true');
            this.addOption('haveTextToSend', 'false');
            this.addOption('haveFileToSend', 'false');
            this.addOption('isFileUpload', 'false');
            this.addOption('textToSend', '');
            this.addOption('filesToSend', '');
        },
        generateHeadersList: function (headers) {
            return headers.map(header => {
                return this.createKeyValuePair(header.name, header.value)
            });
        },
        createOptionNameValue: function (name, value) {
            var option = this.doc.ownerDocument.createElement('option');
            option.setAttribute('name', name);
            option.setAttribute('value', value);
            return option;
        },
        createKeyValuePair: function (name, value) {
            var optionName = this.createOptionNameValue('key', name);
            var optionValue = this.createOptionNameValue('value', value);
            var keyPair = this.doc.ownerDocument.createElement('KeyValuePair');
            keyPair.appendChild(optionName);
            keyPair.appendChild(optionValue);
            return keyPair;
        },
        addOption: function (name, value) {
            let option = this.doc.ownerDocument.createElement('option');
            option.setAttribute('name', name);
            if (typeof value == 'string') {
                option.setAttribute('value', value);
            } else {
                let list = this.doc.ownerDocument.createElement('list');
                value.forEach(item => list.appendChild(item));
                option.appendChild(list);
            }
            this.doc.appendChild(option);
            return option;
        },
        asString: function () {
            var xmlString = this.handler.innerHTML;
            var napespace = this.handler.namespaceURI;

            return xmlString.replace(` xmlns="${napespace}"`, '');
        }
    };
    exports.RestRequest = RestRequest;
});