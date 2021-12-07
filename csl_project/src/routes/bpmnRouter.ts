import { Router } from "express";
import { Checker } from "../logic/Checker";
import { Renderer } from "../logic/Renderer";

const bpmnRouter:Router = Router();

bpmnRouter.get("/", (req, res) => {
    res.send("bpmnfunction");
});

bpmnRouter.post('/checkwithimage', async (req, res) => { 
    
});

bpmnRouter.post('/checkdiagram', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let diagram:any = req.files.diagram;
            
            diagram.mv('./uploads/' + "diagram.bpmn");
            let checker:Checker = new Checker(diagram.data.toString());
            let validation = checker.validateXML();
            let lint = await checker.bpmnlint();
            let renderer = new Renderer();
            renderer.render(checker.bpmnFile);
            //send response
            res.send({
                status: true,
                message: validation === true ? lint : validation,
                data: {
                    name: diagram.name,
                    mimetype: diagram.mimetype,
                    size: diagram.size
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

export default bpmnRouter;
