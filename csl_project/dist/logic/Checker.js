"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checker = void 0;
const fetch = require('node-fetch'); //Need to use require explicitly
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const util_1 = require("util");
const exec = (0, util_1.promisify)(require('child_process').exec);
class Checker {
    bpmn;
    constructor(bpmn) {
        this.bpmn = bpmn;
    }
    objectify(lint) {
        let result = [];
        let s = lint;
        while (s.charAt(0) === '\n') {
            s = s.substring(1);
        }
        while (s.charAt(0) === ' ') {
            s = s.substring(1);
        }
        let sArray = s.split('\n');
        for (let i = 0; i < sArray.length; i++) {
            console.log(sArray[i]);
            result.push({ name: sArray[i].substring(0, sArray[i].indexOf(' ')), type: "t", desc: "" });
        }
        return result;
    }
    validateXML() {
        let valide = fast_xml_parser_1.default.validate(this.bpmn);
        return valide === true ? true : valide;
    }
    validateFromShema() {
        return true; // WIP
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
            console.log("test :");
            console.table(this.objectify(x));
        }
        return x;
    }
}
exports.Checker = Checker;
//# sourceMappingURL=Checker.js.map