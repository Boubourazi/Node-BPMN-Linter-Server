import { getDefaultSettings } from 'http2';
import puppeteer from 'puppeteer';
//const BpmnJS = require('bpmn-js');

export class Renderer {
    constructor() {
        
    }
    
    public async render(bpmn?: string, lint?:any):Promise<File> {
        const browser = await puppeteer.launch({headless: false, slowMo: 250});
        const page = await browser.newPage();
        await page.setContent(`<div id="canvas"></div>`);
        await page.addScriptTag({url: 'https://unpkg.com/bpmn-js@8.8.3/dist/bpmn-viewer.development.js'});
        const t = await page.evaluate(`
            const viewer = new BpmnJS({container:'#canvas'});
            await viewer.importXML(${bpmn});
            viewer.get('canvas').zoom('fit-viewport');
        `);
        console.log(t);
        //
        //await page.setContent(bpmn);
        await browser.close();
        return null;
    }
}