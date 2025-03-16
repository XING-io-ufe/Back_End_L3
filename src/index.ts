import * as dotenv from "dotenv";
import express, {Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import pg from "pg";
import bodyParser = require("body-parser");
import client from "../database/server";

dotenv.config();

const app =express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

const PORT =process.env.PORT || 3000;

// Connect to the database
client.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else { console.log("Connected to the database"); }
});

app.get("/", (req: Request, res: Response) =>{
    res.send("hello, express");
});

app.get("/get", async (req: Request, res: Response) => {
    const query = `SELECT * FROM public."Product"`;
    const result = await client.query(query);
    res.json({
        success: true,
        message: "data complete",
        data: result.rows
    });

});
app.post("/post", async (req: Request, res: Response) => {
    const { ID, Name, Price } = req.body;
    const query = `INSERT INTO public."Product" ("ID", "Name", "Price") VALUES (${ID}, '${Name}', ${Price});`;
    const result = await client.query(query); // No RETURNING clause

    res.json({
        success: true,
        message: `ta  ${Name} nertei, ${Price} iim untei baraa uuslee`,
        data: result.rows
    });

});

app.put("/put", async (req: Request, res: Response) => {
    const { ID, Name } = req.body;
    const query = `UPDATE public."Product" SET "Name" = 'lol' WHERE "ID" = ${ID}`;
    const result = await client.query(query);
        res.json({
            success: true,
            message: `Product with ID ${ID} has been updated.`,
            data: result.rows
        });
});
app.patch("/patch", async (req: Request, res: Response) => {
    const { Price } = req.body;
    const query = `UPDATE public."Product" SET "Price" = ${Price}`;
    const result = await client.query(query);
        res.json({
            success: true,
            message: `Product with ID all has been updated.`,
            data: result.rows
        });
});

app.delete("/delete", async (req: Request, res: Response) => {
    const query = `DELETE FROM Product WHERE ID = ${req.body.id};`;
    const result = await client.query(query);
    res.json({
        success: true,
        message: `tani ${req.body.id} iim dugaartai id ustlaa`,
        data: result.rows
    });
});
app.listen(PORT, async () => {
    console.log(`server runing on port ${PORT}`);
});

module.exports = app;