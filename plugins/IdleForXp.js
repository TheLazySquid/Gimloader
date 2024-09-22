/**
 * @name IdleForXp
 * @description Automatically performs actions to let you gain XP while idle
 * @author TheLazySquid
 * @version 0.1.1
 * @downloadUrl
 * @reloadRequired ingame
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/IdleForXp.js
 */

let questions = [];
let answerDeviceId, currentQuestionId;

function answerQuestion() {
    if(!currentQuestionId) return;

    let question = questions.find(q => q._id == currentQuestionId);
    if(!question) return;

    let packet = {
        key: 'answered',
        deviceId: answerDeviceId,
        data: {}
    }

    if(question.type == 'text') {
        packet.data.answer = question.answers[0].text;
    } else {
        let correctAnswerId = question.answers.find((a) => a.correct)._id;
        packet.data.answer = correctAnswerId;
    }

    GL.net.colyseus.send("MESSAGE_FOR_DEVICE", packet);
};


GL.net.colyseus.addEventListener("DEVICES_STATES_CHANGES", (event) => {
    for(let change of event.detail.changes) {
        let id = change[0];
        for(let i = 0; i < change[1].length; i++) {
            let index = change[1][i];
            let key = event.detail.values[index];
            let value = change[2][i];
            if(key == "GLOBAL_questions") {
                questions = JSON.parse(value);
                console.log("Got questions", questions);
                
                answerDeviceId = id;
            }
        
            let playerId = GL.stores.phaser.mainCharacter.id;

            if(key == `PLAYER_${playerId}_currentQuestionId`) {
                currentQuestionId = value;
            }
        } 
    }
});

function start() {
    GL.notification.open({ message: "IdleForXp is active" });
    setInterval(answerQuestion, 30000);
}

if(GL.net.type === "Colyseus") start();
GL.addEventListener("loadEnd", () => {
    if(GL.net.type === "Colyseus") start();
}, { once: true })

export function onStop() {
    clearInterval(answerQuestion);
}