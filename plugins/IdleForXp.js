/**
 * @name IdleForXp
 * @description Automatically performs actions to let you gain XP while idle
 * @author TheLazySquid
 * @version 0.2.1
 * @webpage https://thelazysquid.github.io/Gimloader/plugin/idleforxp
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/IdleForXp.js
 */
const api = new GL();

let questioner, questions;
api.net.onLoad(() => {
    let devices = GL.stores?.phaser.scene.worldManager.devices.allDevices;
    questioner = devices.find(d => d.deviceOption.id == "gimkitLiveQuestion");
    if(!questioner) return;

    questions = JSON.parse(questioner.state.questions);
});

function answerQuestion() {
    if(!questioner) return;

    let question = questions.find(q => q._id == questioner.state.currentQuestionId);
    if(!question) return;

    let packet = {
        key: 'answered',
        deviceId: questioner.id,
        data: {}
    }

    if(question.type == 'text') {
        packet.data.answer = question.answers[0].text;
    } else {
        let correctAnswerId = question.answers.find((a) => a.correct)._id;
        packet.data.answer = correctAnswerId;
    }

    GL.net.send("MESSAGE_FOR_DEVICE", packet);
};

api.net.onLoad((type) => {
    if(type != "Colyseus") return;
    
    GL.notification.open({ message: "IdleForXp is active" });
    setInterval(answerQuestion, 3000);
    api.onStop(() => clearInterval(answerQuestion));
});