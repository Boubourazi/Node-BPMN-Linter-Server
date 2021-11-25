const fetch:any = require('node-fetch');
import express from 'express';
import parser from 'fast-xml-parser';
import validator from "xsd-schema-validator";
import { promisify } from 'util';
const exec = promisify(require('child_process').exec);


export class Checker{
    constructor(private readonly bpmn:string){
    }

    validateXML():true|parser.ValidationError{
        let valide = parser.validate(this.bpmn);
        return valide === true ? true : valide;
    }

    validateFromShema():boolean{
        return true; // WIP
    }

    parse():Map<String, String>{
        return new Map<String, String>();
    }

    async bpmnlint():Promise<any>{
        let x = null;
        try{
            x = await exec('node ./node_modules/bpmnlint/bin/bpmnlint.js ./uploads/diagram.bpmn');
        }
        catch(e){
            let errorString:String = e.stdout.toString();
            x = errorString.substring(errorString.indexOf("diagram.bpmn") + 12);

        }
        finally{
            console.log("test :" + x);
        }
        return x;
    }
}