import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import morgan from 'morgan';
import _ from 'lodash';
import bpmnRouter from "./routes/bpmnRouter";


const app = express();
const port = 8080; // default port to listen

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route Delegation
app.use("/bpmnfunction", bpmnRouter);

app.get("/", (req, res) => {
    res.send("home");
})

// start the Express serverv
app.listen(port, () => {
    console.log(`server started
     http://localhost:${port}`);
});
