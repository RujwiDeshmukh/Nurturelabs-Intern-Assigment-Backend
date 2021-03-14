const express = require("express");

const App = express();

//port
const PORT = process.env.PORT || 3001;

//ROUTES
//TEST ROUTE
App.get("/test", (req, res) => {
  res.status(200).send("RUNNING");
});
// server listem
App.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
