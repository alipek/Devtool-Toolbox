/**
 * Created by Andrzej Lipka on 21.07.2016.
 */
'use strict';
const { Ci, Cc} = require("chrome");
const filePicker = Cc["@mozilla.org/filepicker;1"];
const fos = Cc["@mozilla.org/network/file-output-stream;1"];
const convertStream = Cc["@mozilla.org/intl/converter-output-stream;1"];
const {window} = require('sdk/addon/window');
const OPEN_FLAGS = {
    RDONLY: parseInt("0x01", 16),
    WRONLY: parseInt("0x02", 16),
    CREATE_FILE: parseInt("0x08", 16),
    APPEND: parseInt("0x10", 16),
    TRUNCATE: parseInt("0x20", 16),
    EXCL: parseInt("0x80", 16)
};
(function (exports) {
    let FilePicker = function () {

    };

    function saveToFile(file, content) {
        let foStream = fos.createInstance(Ci.nsIFileOutputStream);

        // write, create, truncate
        let openFlags = OPEN_FLAGS.WRONLY | OPEN_FLAGS.CREATE_FILE |
            OPEN_FLAGS.TRUNCATE;

        let permFlags = parseInt("0666", 8);
        foStream.init(file, openFlags, permFlags, 0);

        let converter = convertStream.createInstance(Ci.nsIConverterOutputStream);

        converter.init(foStream, "UTF-8", 0, 0);

        // The entire content can be huge so, write the data in chunks.
        let chunkLength = 1024 * 1204;
        for (let i = 0; i <= content.length; i++) {
            let data = content.substr(i, chunkLength + 1);
            if (data) {
                converter.writeString(data);
            }
            i = i + chunkLength;
        }

        // this closes foStream
        converter.close();

    }

    FilePicker.save = function (content, filename, extension) {
        let fp = filePicker.createInstance(Ci.nsIFilePicker);
        fp.init(window, 'Dialog Title', Ci.nsIFilePicker.modeSave);
        
        if (filename != undefined) {
            fp.defaultString = filename;
        }
        if (extension != undefined) {
            fp.defaultExtension = extension;
        }

        if (fp.show() != Ci.nsIFilePicker.returnOK) {
            return;
        }
        saveToFile(fp.file, content);
    };
    exports.FilePicker = FilePicker;
})(exports);