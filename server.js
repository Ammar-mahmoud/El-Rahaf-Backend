const express = require('express');
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${process.env.NODE_ENV}`);
}
  
const app = express();
app.get('/',(req, res)=>{
    res.send('Hello World!')
});
const PORT = process.env.PORT || 7000;

const server = app.listen(PORT, () => {
  console.log(`App running on Port ${PORT}`);
});