const express = require("express");
// express 모듈 가져오기
const app = express();
// 새로운 app 가져오기
const port = 5000;

const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://hwangkyojin:vosekwmf1@boilerplate.nlg0b98.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // 버전차이 최신버전에서는 지원안함(그대로 쓰면 오류남)
            // useCreateIndex: true,
            // useFindAndModify: false,
        }
    )
    .then(() => console.log("mongodb connection"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
