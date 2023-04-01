const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        // 스페이스 알아서 채워준다.
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

// userSchema를 저장하기 전에 해주고 싶은 function
userSchema.pre("save", function (next) {
    // user안에 있는 password를 꺼낼수있다.
    let user = this;

    // 조건문을 생성해서 password가 변경 될때만 아래 로직이 수행되게 한다.
    if (user.isModified("password")) {
        // 비밀번호를 암호화 시킨다.
        // 1. Salt를 가져온다.
        // 2. bcrypt.hash(myPlaintextPassword = 내가 최초에 입력한 Password)
        // let user = this , user.password 를 활용해 입력한 password를 hash 암호화 시킨다.
        // 3. user.password = hash 로 변환하여 DB에 저장한다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword 1234567 암호화된 비밀번호 ##210#l492

    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err), cb(null, isMatch);
    });
};

userSchema.methods.generateToekn = function () {};
// const User = mongoose.model("모델의 이름", "Schema명");
const User = mongoose.model("User", userSchema);

module.exports = { User };
