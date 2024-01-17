const express = require("express");
const fs = require("fs");

module.exports.load = function (app, db) {
    app.post("/api/messages/send", async (req, res) => {
        try {
            const { content, user } = req.query;

            // Initialisiere die Datei, falls sie nicht vorhanden ist
            if (!fs.existsSync("./inbox.json")) {
                fs.writeFileSync("./inbox.json", '{"messages": []}', 'utf8');
            }

            // Lade die vorhandenen Nachrichten aus der Datei
            const messagesData = JSON.parse(fs.readFileSync("./inbox.json", "utf8"));
            const messages = messagesData.messages || [];

            // Füge die neue Nachricht im gewünschten Format hinzu
            const newMessage = {
                toUserId: user,
                fromUser: req.session.userinfo ? req.session.userinfo.username : 'Anonymous',
                content
            };

            // Füge die neue Nachricht zum vorhandenen Array hinzu
            messages.push(newMessage);

            // Speichere die aktualisierten Nachrichten in der Datei
            fs.writeFileSync("./inbox.json", JSON.stringify(messagesData, null, 2), "utf8");

            res.status(200).json({ success: true, message: "Nachricht erfolgreich gesendet.", newMessage });
        } catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    });
};
