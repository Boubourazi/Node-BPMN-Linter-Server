"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const bpmnRouter_1 = __importDefault(require("./routes/bpmnRouter"));
const app = (0, express_1.default)();
const port = 8080; // default port to listen
// enable files upload
app.use((0, express_fileupload_1.default)({
    createParentPath: true
}));
//add other middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Route Delegation
app.use("/bpmnfunction", bpmnRouter_1.default);
app.get("/", (req, res) => {
    res.send("home");
});
// start the Express serverv
app.listen(port, () => {
    console.log(`server started
     http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map