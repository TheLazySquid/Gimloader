import express from 'express';

const port = 5822; // picked at random

export default class Poller {
    code: string | null = null;
    isLibrary = false;
    codeSent = false;
    longPollRes: express.Response | null = null;

    updateCode(code: string) {
        if(code === this.code) return;
        this.code = code;

        if(this.longPollRes) {
            this.longPollRes.setHeader('Is-Library', this.isLibrary.toString());
            this.longPollRes.send(this.code);
            this.codeSent = true;
            this.longPollRes = null;
        } else {
            this.codeSent = false;
        }
    }

    constructor() {
        const app = express();

        // serve the file
        app.get('/getCode', (_, res) => {
            if(this.code) {
                res.setHeader('Is-Library', this.isLibrary.toString());
                res.type('js');
                res.send(this.code);
            } else {
                res.status(500).send("No code available");
            }
        });

        let lastUid = '';
        app.get('/getUpdate', (req, res) => {
            let uid = req.headers.uid as string;

            res.type('js');
            if((this.codeSent && uid === lastUid) || !this.code) {
                // disregard duplicate requests
                if(this.longPollRes) {
                    this.longPollRes.status(500).send("Another request is already pending");
                }
                
                this.longPollRes = res;
            } else {
                res.setHeader('Is-Library', this.isLibrary.toString());
                res.send(this.code);
                this.codeSent = true;
            }

            lastUid = uid;
        })

        app.listen(port);
    }
}