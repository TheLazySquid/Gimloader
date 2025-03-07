import express from './express.js';
import { matchMaker, Server } from "colyseus";
import { BunWebSockets } from "@colyseus/bun-websockets";
import { GameRoom } from './room.js';
import { generateGameCode } from './utils.js';

const server = new Server({ transport: new BunWebSockets() });

server.define("MapRoom", GameRoom);
server.listen(5824);

interface Game {
    intentId: string;
    mapId: string;
}
let games: Game[] = [];

// creating games
express.post("/api/matchmaker/intent/map/play/create", async (req, res) => {
    // random map for now
    let game = {
        intentId: crypto.randomUUID(),
        mapId: crypto.randomUUID()
    };
    games.push(game);

    res.send(game.intentId);
});

express.get("/api/matchmaker/intent/fetch-source/:id", (req, res) => {
    res.send("map");
});

express.get("/api/matchmaker/intent/map/summary/:id", (req, res) => {
    let game = games.find((g) => g.intentId === req.params.id);
    if(game) {
        res.json({ mapId: game.mapId });
    } else {
        res.status(404).send();
    }
});

express.post("/api/matchmaker/find-server-to-host-game", (req, res) => {
    res.json({ url: "http://localhost:5824" });
});

// add fallbacks for unimplemented routes
express.get("*", (req, res) => {
    console.log("Client requested missing route with GET:", req.url);
    res.status(501).send("Not implemented");
});
express.post("*", (req, res) => {
    console.log("Client requested missing route with POST:", req.url);
    res.status(501).send("Not implemented");
});