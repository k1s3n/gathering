const express = require("express");
const { connectToMongoDB } = require("./server/server");
const userController = require("./controller/userController");

const app = express();


connectToMongoDB();

userController.createEvent("66672c4b67b0dad04feb747e", {title: "test", description: "test"});



app.get("/", (req, res) => {
    res.send("backend runs on port 4000");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend Server running on port http://localhost:${PORT}`));
