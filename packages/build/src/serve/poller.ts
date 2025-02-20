import http from 'node:http';

const port = 5822; // picked at random

export default class Poller {
    code: string | null = null;
    isLibrary = false;
    codeSent = false;
    longPollRes: http.ServerResponse | null = null;

    updateCode(code: string) {
        if(code === this.code) return;
        this.code = code;

        if(this.longPollRes) {
            this.longPollRes.setHeader('is-library', this.isLibrary.toString());
            this.longPollRes.setHeader('access-control-allow-origin', '*');
            this.longPollRes.write(this.code);
            this.longPollRes.end();
            this.codeSent = true;
            this.longPollRes = null;
        } else {
            this.codeSent = false;
        }
    }

    constructor() {
        let lastUid = '';

        const server = http.createServer((req, res) => {
            if(req.url === "/getCode") {
                if(this.code) {
                    res.setHeader('is-library', this.isLibrary.toString());
                    res.setHeader('content-type', 'application/javascript');
                    res.setHeader('access-control-allow-origin', '*');
                    res.write(this.code);
                } else {
                    res.writeHead(500);
                    res.write("No code available");
                }
                res.end();
            } else if(req.url === "/getUpdate") {
                let uid = req.headers.uid as string;

                res.setHeader('content-type', 'application/javascript');
                res.setHeader('access-control-allow-origin', '*');
                if((this.codeSent && uid === lastUid) || !this.code) {
                    // disregard duplicate requests
                    if(this.longPollRes) {
                        this.longPollRes.writeHead(500);
                        this.longPollRes.write("Another request is already pending");
                    }
                    
                    this.longPollRes = res;
                } else {
                    res.setHeader('is-library', this.isLibrary.toString());
                    res.write(this.code);
                    res.end();
                    this.codeSent = true;
                }
    
                lastUid = uid;
            }
        });

        server.listen(port);
    }
}