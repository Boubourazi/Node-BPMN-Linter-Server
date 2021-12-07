import { getDefaultSettings } from 'http2';
import puppeteer from 'puppeteer';
//const BpmnJS = require('bpmn-js');

export class Renderer {
    constructor() {
        
    }
    
    public async render(bpmn?: string, lint?:any):Promise<File> {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setContent(`<div id="canvas"></div>`);
        await page.addScriptTag({url: 'https://unpkg.com/bpmn-js@8.8.3/dist/bpmn-viewer.development.js'});
        const t = await page.evaluate(`(async () => {
                const viewer = new BpmnJS({container:'#canvas'});
                await viewer.importXML(\`${bpmn.toString()}\`);
                viewer.get('canvas').zoom('fit-viewport');
            })();
        `);
        await page.screenshot({ path: './screenshots/example.png' });
        console.log("screen done");
        //
        //await page.setContent(bpmn);
        await browser.close();
        return null;
    }
}