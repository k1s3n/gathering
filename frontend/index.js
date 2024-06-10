const express = require("express");


const app = express();

app.get("/", (req, res) => {
    res.send("frontend runs on port 3000");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`frontend server running on port http://localhost:${PORT}`));
