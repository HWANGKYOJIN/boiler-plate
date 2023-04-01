const express = require("express");
// express 모듈 가져오기
const app = express();
// 새로운 app 가져오기
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");
const config = require("./config/key");
const jwt = require("jsonwebtoken");

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
const user = new User(req.body);
app.post("/register", async (req, res) => {
    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
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

app.post("/login", (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.

    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다.",
            });
        }
    });

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
            return res.json({
                loginSuccess: false,
                message: "비밀번호가 틀렸습니다.",
            });
        // 비밀번호가 맞다면 토큰 생성.

        user.generateToken((err, user) => {});
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
