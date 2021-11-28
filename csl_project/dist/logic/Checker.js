"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checker = void 0;
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
        let sArray = s.split('\n').map(x => {
            while (x.charAt(0) === ' ') {
                x = x.substring(1);
            }
            return x;
        });
        for (let i = 0; i < sArray.length; i++) {
            let firstSpace = sArray[i].indexOf(' ');
            let secondSpace = sArray[i].indexOf(' ', firstSpace + 1);
            while (sArray[i].charAt(secondSpace) === ' ') {
                secondSpace++;
            }
            let thirdSpace = sArray[i].indexOf(' ', secondSpace + 1);
            while (sArray[i].charAt(thirdSpace) === ' ') {
                thirdSpace++;
            }
            result.push({ name: sArray[i].substring(0, firstSpace), type: sArray[i].substring(secondSpace, thirdSpace - 2), desc: sArray[i].substring(thirdSpace) });
        }
        result = result.filter(x => (x.name !== '' && x.name !== '✖') && x.type !== '' && x.desc !== ''); //Remove empty lines and last line 
        result = result.map(x => ({ name: x.name, type: x.type, desc: x.desc.substring(0, x.desc.indexOf('   ')) })); //Remove the linter parameter label
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
        let result = null;
        try {
            x = await exec('node ./node_modules/bpmnlint/bin/bpmnlint.js ./uploads/diagram.bpmn');
        }
        catch (e) {
            let errorString = e.stdout.toString();
            x = errorString.substring(errorString.indexOf("diagram.bpmn") + "diagram.bpmn".length);
        }
        result = x.includes("unparsable content") ? [{ name: "XSD Error", type: "error", desc: "The file is not a valid BPMN according to the XSD" }] : this.objectify(x);
        return result;
    }
}
exports.Checker = Checker;
//# sourceMappingURL=Checker.js.map