import parser from 'fast-xml-parser';
import { promisify } from 'util';
import { Lint } from './Lint';
const exec = promisify(require('child_process').exec);
import fs from 'fs/promises';


export class Checker{
    constructor(private readonly bpmn:string){
    
    }
    
    
    public get bpmnFile() : string {
        return this.bpmn;
    }
    
    
    private objectify(lint:string):Lint[]{
        let result:Lint[] = [];
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
            result.push({name: sArray[i].substring(0, firstSpace), type:sArray[i].substring(secondSpace, thirdSpace-2), desc:sArray[i].substring(thirdSpace)});
        }

        result = result
            .filter(x => (x.name !== '' && x.name !== '✖') && x.type !== '' && x.desc !== '') // Filter empty lines
            .map(x => ({name:x.name, type:x.type, desc:x.desc.substring(0, x.desc.indexOf('   '))}));//Remove empty lines and last line 
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
        let x:string = null;
        let result = null;
        try{
            x = await exec('node ./node_modules/bpmnlint/bin/bpmnlint.js ./uploads/diagram.bpmn');
        }
        catch(e){
            let errorString:string = e.stdout.toString();
            x = errorString.substring(errorString.indexOf("diagram.bpmn") + "diagram.bpmn".length);
        }
        result = x.includes("unparsable content") ? [{name:"XSD Error", type:"error", desc:"The file is not a valid BPMN against the XSD"}] : this.objectify(x);
        return result;
    }
}