const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/save", (req, res) => {

    let capsules = [];

    if (fs.existsSync("capsule.json")) {
        capsules = JSON.parse(fs.readFileSync("capsule.json"));
    }

    const newCapsule = {
        id: Date.now(),
        message: req.body.message,
        openTime: req.body.openTime
    };

    capsules.push(newCapsule);

    fs.writeFileSync("capsule.json", JSON.stringify(capsules, null, 2));

    res.send("Capsule Saved Successfully! <br><a href='/'>Go Back</a>");
});

app.get("/open", (req, res) => {

    if (!fs.existsSync("capsule.json")) {
        return res.send("No Capsules Found");
    }

    const capsules = JSON.parse(fs.readFileSync("capsule.json"));
    const currentTime = new Date();

    let output = "<h2>Capsules</h2>";

    capsules.forEach(capsule => {

        const openDate = new Date(capsule.openTime);

        if (currentTime >= openDate) {
            output += `<p><b>Message:</b> ${capsule.message} ✅</p>`;
        } else {
            output += `<p>🔒 Locked Capsule</p>`;
        }
    });

    output += "<br><a href='/'>Back</a>";

    res.send(output);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
