const UserModel = require("../models/UserModel");
const ActionModel = require("../models/ActionModel");

const jwt = require("jsonwebtoken");
exports.getUser = (req, res) => {
    UserModel.find().then(e => res.json(e)).catch(er => console.log(er));
}
exports.getAction = (req, res) => {
    ActionModel.findById(req.body.id).then(e => res.json(e)).catch(er => console.log(er));
}
exports.EditUser = (req, res) => {
    UserModel.findById(req.body.id).then(e => {
        e.email = req.body.email;
        e.name = req.body.name;
        e.save().then(ee => res.json(ee)).catch(es => console.log(es));
    }).catch(er => console.log(er));
}
exports.actionUser = (req, res) => {
    ActionModel.findOne({ userID: req.body.userID, weekNo: req.body.weekNum, entryname: req.body.entryname }).then(e => {
        if (e) {
            e.selectTeamNo = req.body.id;
            e.save().then(ee => res.json("update")).catch(es => console.log(es));
        } else {
            new ActionModel({
                selectTeamNo: req.body.id,
                userID: req.body.userID,
                entryname: req.body.entryname,
                weekNo: req.body.weekNum
            })
                .save()
                .then(v => res.json("add"))
                .catch(err => console.log(err));
        }
    }).catch(er => console.log(er));
}
exports.DeleteUser = (req, res) => {
    UserModel.findById(req.body.id).then(e => {
        e.status = req.body.flag === "del" ? 2 : 1;
        e.save().then(resa => res.json(resa)).catch(err => console.log(err))
        // e.countANDpay.push({ count: 3, pay: 50 });
        // e.save().then();
    }).catch(er => console.log(er));

}
exports.registerUser = (req, res) => {
    UserModel.findOne({ email: req.body.email })
        .then(e => {
            if (e) res.status(400).json("already exists.");
            else {
                new UserModel({
                    email: req.body.email,
                    name: req.body.name,
                    password: req.body.password
                })
                    .save()
                    .then(e => res.json(e))
                    .catch(err => console.log(err))
            }
        })
        .catch(er => console.log(er));
}

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email }).then(user => {
        if (user) {
            if (user.status == 1 || user.status == 2) {
                res.status(400).json("You can't login in this site.")
            }
            else if (user.password != password) {
                res.status(400).json("incorrect password")
            }
            const payload = {
                id: user._id,
                email: user.email,
                pass: user.password,
                name: user.name,
                countANDpay: user.countANDpay,
                status: user.status,
                role: user.role
            };
            jwt.sign(
                payload,
                'secret',
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });

                }
            )
        } else {
            res.status(400).json("not exists.");
        }
    }).catch(err => console.log(err));
}
exports.editprofile = (req, res) => {
    console.log(req.body);
    UserModel.findOne({ email: req.body.email }).then(e => {
        if (e) {
            e.name = req.body.name;
            e.password = req.body.password;
            e.save().then(e => res.json(e)).catch(er => console.log(er))
        }
    }).catch(err => console.log(err))
}