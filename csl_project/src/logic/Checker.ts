const fetch:any = require('node-fetch');//Need to use require explicitly
import express from 'express';
import parser from 'fast-xml-parser';
import validator from "xsd-schema-validator";
import { promisify } from 'util';
import { first, stubArray } from 'lodash';
const exec = promisify(require('child_process').exec);


export class Checker{
    constructor(private readonly bpmn:string){
    }

    private objectify(lint:string):any{
        let result:{name:string, type:string, desc:string}[] = [];
        let s = lint;
        while(s.charAt(0) === '\n'){
            s = s.substring(1);
        }
        while(s.charAt(0) === ' '){
            s = s.substring(1);
        }
        let sArray = s.split('\n').map(x => {
            while(x.charAt(0) === ' '){
                x = x.substring(1);
            }
            return x;
        });

        for(let i = 0; i < sArray.length; i++){
            let firstSpace = sArray[i].indexOf(' ');
            let secondSpace = sArray[i].indexOf(' ', firstSpace + 1);
            while(sArray[i].charAt(secondSpace) === ' '){
                secondSpace++;
            }
            let thirdSpace = sArray[i].indexOf(' ', secondSpace + 1);
            while(sArray[i].charAt(thirdSpace) === ' '){
                thirdSpace++;
            }
            console.log(firstSpace, secondSpace, thirdSpace);
            result.push({name: sArray[i].substring(0, firstSpace), type:sArray[i].substring(secondSpace, thirdSpace-2), desc:sArray[i].substring(thirdSpace)});
        }
        return result;
    }

    validateXML():true|parser.ValidationError{
        let valide = parser.validate(this.bpmn);
        return valide === true ? true : valide;
    }

    validateFromShema():boolean{
        return true; // WIP
    }


    async bpmnlint():Promise<any>{
        let x = null;
        try{
            x = await exec('node ./node_modules/bpmnlint/bin/bpmnlint.js ./uploads/diagram.bpmn');
        }
        catch(e){
            let errorString:string = e.stdout.toString();
            x = errorString.substring(errorString.indexOf("diagram.bpmn") + 12);

        }
        finally{
            console.log("test :");
            console.table(this.objectify(x))
        }
        return x;
    }
}