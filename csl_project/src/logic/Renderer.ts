import { getDefaultSettings } from 'http2';
import puppeteer from 'puppeteer';
import { Lint } from './Lint';
import fs from 'fs/promises';
import { Stats } from 'fs';
import { join } from 'path/posix';

//const BpmnJS = require('bpmn-js');

export class Renderer {
    constructor() {
        
    }
    
    public async render(bpmn?: string, lint?:Lint):Promise<File> {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setContent(`<div id="canvas"></div>`);
        await page.addScriptTag({url: 'https://unpkg.com/bpmn-js@8.8.3/dist/bpmn-viewer.development.js'});
        const t = await page.evaluate(`
            (async () => {
                const viewer = new BpmnJS({container:'#canvas'});
                await viewer.importXML(\`${bpmn.toString()}\`);
                viewer.get('canvas').zoom('fit-viewport');
            })();
        `);
        await fs.stat('screenshots').catch(() => fs.mkdir('screenshots'));
        await page.screenshot({ path: './screenshots/example.png' });
        console.log("screen done");
        //
        //await page.setContent(bpmn);
        await browser.close();
        return null;
    }

    private getErrors(lints:Lint[]):string[] {
        return lints.filter(lint => lint.type === "error").map(l => l.name);
    }

    private getWarnings(lints:Lint[]):string[] {
        return lints.filter(lint => lint.type === "warning").map(l => l.name);
    }
}