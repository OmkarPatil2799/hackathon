require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: 'https://hackathon-65ad6.web.app' }));
app.use(express.json());

// app.use("/api/budget", require("./routes/budget"));
app.use("/api/funding", require("./routes/funding-helper"));
app.use("/api/advisor", require("./routes/advisor")); // ← this now talks to Groq
// app.use("/api/upload", require("./routes/upload"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
