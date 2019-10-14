require("dotenv").config();
const app = require("./app");
const env = app.get("env")

let port;
if (app.get("env") === "development") {
  port = 5000;
}

app.listen(port, () => console.log(`Server is listening on ${port} in ${env} mode`));
