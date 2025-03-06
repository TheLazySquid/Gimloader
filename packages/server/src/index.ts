import express from './express.js';

express.get("*", (req, res) => {
    console.log("Client requested missing route with GET:", req.url);
    res.status(501).send("Not implemented");
});
express.post("*", (req, res) => {
    console.log("Client requested missing route with POST:", req.url);
    res.status(501).send("Not implemented");
});