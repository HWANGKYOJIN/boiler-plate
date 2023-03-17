const express = require("express");
// express 모듈 가져오기
const app = express();
// 새로운 app 가져오기
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // 버전차이 최신버전에서는 지원안함(그대로 쓰면 오류남)
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then(() => console.log("mongodb connection"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World");
});

// 회원가입을 위한 router
// 변경한 코드
app.post("/register", async (req, res) => {
    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body);
    try {
        await user.save();
        return res.status(200).json({
            success: true,
        });
    } catch (err) {
        if (err)
            return res.json({
                success: false,
                err,
            });
    }
});
// 이전버전에서 오류발생함.
// (err, useInfo) => {
//     if (err) return res.json({ success: false, err });
//     return res.status(200).json({
//         success: true,
//     });
// }

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
