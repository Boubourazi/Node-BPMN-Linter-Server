"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Checker_1 = require("../logic/Checker");
const bpmnRouter = (0, express_1.Router)();
bpmnRouter.get("/", (req, res) => {
    res.send("bpmnfunction");
});
bpmnRouter.post('/checkdiagram', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        }
        else {
            let diagram = req.files.diagram;
            console.log(diagram.name);
            diagram.mv('./uploads/' + "diagram.bpmn");
            let checker = new Checker_1.Checker(diagram.data.toString());
            let validation = checker.validateXML();
            let lint = await checker.bpmnlint();
            //send response
            res.send({
                status: true,
                message: validation === true ? lint.toString() : validation,
                data: {
                    name: diagram.name,
                    mimetype: diagram.mimetype,
                    size: diagram.size
                }
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
exports.default = bpmnRouter;
//# sourceMappingURL=bpmnRouter.js.map