"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checker = void 0;
const fetch = require('node-fetch');
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const util_1 = require("util");
const exec = (0, util_1.promisify)(require('child_process').exec);
class Checker {
    bpmn;
    constructor(bpmn) {
        this.bpmn = bpmn;
    }
    validateXML() {
        let valide = fast_xml_parser_1.default.validate(this.bpmn);
        return valide === true ? true : valide;
    }
    validateFromShema() {
        return true; // WIP
    }
    parse() {
        return new Map();
    }
    async bpmnlint() {
        let x = null;
        try {
            x = await exec('node ./node_modules/bpmnlint/bin/bpmnlint.js ./uploads/diagram.bpmn');
        }
        catch (e) {
            let errorString = e.stdout.toString();
            x = errorString.substring(errorString.indexOf("diagram.bpmn") + 12);
        }
        finally {
            console.log("test :" + x);
        }
        return x;
    }
}
exports.Checker = Checker;
//# sourceMappingURL=Checker.js.map