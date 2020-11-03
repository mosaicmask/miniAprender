"use strict";
var Prism = require("@prism-react-renderer/prism");
var normalize = require("../../utils/normalize").default;
Component({
    properties: {
        language: {
            type: String
        },
        code: {
            type: String
        }
    },
    data: {
        tokenLines: []
    },
    observers: {
        language: function () {
            this.generate();
        },
        code: function () {
            this.generate();
        }
    },
    methods: {
        generate: function () {
            this.setData({
                tokenLines: normalize(Prism.tokenize(this.properties.code, Prism.languages[this.properties.language]))
            });
        }
    }
});
