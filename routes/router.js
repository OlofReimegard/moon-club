const express = require('express');
const router = express.Router();
const text = require("../text.json");
const sqlFun = require("../sqlFun.js");
const passFun = require("../passFun.js");
const redisFun = require("../redisFun.js");

// ***************** / *********************

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect("/sign");
    } else {
        res.redirect("/register");
    }
});


// ***************** REGISTER *********************

router.route('/register')

    .get((req, res) => {
        if (!req.session.user) {
            res.render("registration", {
                layout: 'template',
                goback: text.goback,
                title: text.moonclub,
                description: text.descone,
                csrfToken: req.csrfToken(),
            });
        } else {
            res.redirect("/sign");
        }
    })

    .post((req, res) => {
        passFun.hashPassword(req.body.password).then((password) => {
            sqlFun.insertUser(req.body, password).then((pswrd) => {
                sqlFun.readUser().then((data) => {
                    let id;
                    data.forEach((item) => {
                        if (item.email == req.body.email) {
                            id = item.id;
                            req.session.user = {
                                first_name: req.body.first,
                                last_name: req.body.last,
                                email: req.body.email,
                                password: pswrd,
                                id: id,
                                signed: false
                            };
                            res.redirect("/profile");
                        }
                    });

                });


            });
        });
    });


// ***************** MAKE PROFILE *********************

router.route('/profile')

    .get((req, res) => {
        if (!req.session) {
            res.redirect("/");
        } else {
            res.render("profile", {
                layout: 'template',
                csrfToken: req.csrfToken(),
                goback: text.goback,
                title: text.moonclub,
                description: text.descthree
            });
        }
    })

    .post((req, res) => {
        req.session.user.age = req.body.age;
        req.session.user.city = req.body.city;
        req.session.user.url = req.body.url;
        redisFun.clearDb();
        sqlFun.insertProfile(req.session.user.id, req.body).then(() => {
            res.redirect("/sign");
        });
    });


// ***************** LOGIN *********************

router.route('/login')

    .get((req, res) => {
        res.render("login", {
            layout: 'template',
            csrfToken: req.csrfToken()
        });
    })

    .post((req, res) => {
        if(req.body.password.length < 1) {
            res.redirect("/login");
        }

        sqlFun.readProfileInfo().then((users) => {
            users.forEach((item) => {
                if(req.body.email == item.email){
                    passFun.checkPassword(req.body.password, item.password).then((val) => {
                        if(val){
                            req.session.user = {
                                first_name: item.first,
                                last_name: item.last,
                                email: item.email,
                                password: item.password,
                                age: item.age,
                                city: item.city,
                                url: item.url,
                                id: item.id,
                                signed: false
                            };

                            sqlFun.readSign().then((signs) => {
                                signs.forEach((item) => {
                                    if(item.id == req.session.user.id){
                                        req.session.user.signed = true;
                                        res.redirect("/thanks");
                                    }
                                });

                                if(req.session.user.signed == false){
                                    res.redirect("/sign");
                                }
                            });
                        } else if (!val) {
                            res.redirect("/login");
                        }
                    }) ;
                }
            });
        });
    });


// ***************** GET SIGNATURE *********************

router.get('/sign', (req, res) => {
    if(req.session.user.signed == true){
        res.redirect("/thanks");
    } else {
        res.render("sign", {
            layout: 'template',
            goback: text.goback,
            title: text.moonclub,
            description: text.descone,
            csrfToken: req.csrfToken(),
            first: req.session.user.first_name,
            last: req.session.user.last_name,
        });
    }
});


// ***************** GET THANK YOU PAGE *********************

router.get('/thanks', (req, res) => {
    if(req.session.user.signed == true) {
        sqlFun.readSign().then((data) => {
            data.forEach((item) => {
                if (item.id == req.session.user.id) {
                    res.render("other", {
                        layout: 'template',
                        goback: text.goback,
                        title: text.moonclub,
                        description: text.desctwo,
                        img: item.signature
                    });
                }
            });
        });
    } else {
        res.redirect("/sign");
    }
});


// ***************** EDIT PROFILE *********************

router.route('/profile/edit')

    .get((req, res) => {
        res.render("edit", {
            layout: 'template',
            csrfToken: req.csrfToken(),
            first: req.session.user.first_name,
            last: req.session.user.last_name,
            email: req.session.user.email,
            age: req.session.user.age,
            city: req.session.user.city,
            url: req.session.user.url,
        });
    })

    .post((req, res) => {
        let pswrd;
        if(!req.body.password){
            pswrd = req.session.user.password;
            req.session.user = {
                first_name: req.body.first,
                last_name: req.body.last,
                email: req.body.email,
                password: pswrd,
                id: req.session.user.id,
                age: req.body.age,
                city: req.body.city,
                url: req.body.url,
                signed: req.session.user.signed
            };
            redisFun.clearDb();
            sqlFun.updateUser(req.session.user.id, req.body, pswrd).then(() => {
                sqlFun.updateProfile(req.session.user.id, req.body).then(() => {
                    res.redirect("/sign");
                });
            });

        } else {
            pswrd = req.body.password;
            passFun.hashPassword(pswrd).then((password) => {
                req.session.user = {
                    first_name: req.body.first,
                    last_name: req.body.last,
                    email: req.body.email,
                    password: password,
                    id: req.session.user.id,
                    age: req.body.age,
                    city: req.body.city,
                    url: req.body.url,
                    signed: req.session.user.signed
                };
                redisFun.clearDb();
                sqlFun.updateUser(req.session.user.id, req.body, password).then(() => {
                    sqlFun.updateProfile(req.session.user.id, req.body).then(() => {
                        res.redirect("/sign");
                    });
                });
            });
        }

    })

;


// ***************** POST SIGNATURE *********************

router.post('/postsign', (req, res) => {

    sqlFun.insertSign(req.body.signature, req.session.user.id).then(() => {
        req.session.user.signed = true;
        redisFun.clearDb();
        res.redirect("/thanks");
    });
});


// ***************** GET SIGNATURES *********************

router.get('/signed', (req, res) => {
    if (!req.session.user.signed) {
        res.redirect("/");
    } else {
        redisFun.checkSignFromDb(sqlFun.readProfile()).then(() => {
            redisFun.getSignFromDb().then((data) => {
                res.render("signed", {
                    layout: 'template',
                    goback: text.goback,
                    title: text.moonclub,
                    description: text.desctwo,
                    list: data
                });
            });
        });
    }
});


// ***************** GET SIGNATURES FROM AREA *********************

router.get('/signed/:area', (req, res) => {
    if (!req.session.user.signed) {
        res.redirect("/");
    } else {
        redisFun.checkSignFromDb(sqlFun.readProfile()).then(() => {
            redisFun.getSignFromDbArea(req.params.area).then((data) => {
                res.render("signed", {
                    layout: 'template',
                    goback: text.goback,
                    title: text.moonclub,
                    description: text.desctwo,
                    list: data
                });
            });
        });
    }
});


// ***************** DELETE SIGNATURE *********************

router.get('/delete', (req, res) => {
    sqlFun.deleteSign(req.session.user.id).then((result) => {
        delete req.session.user.signed;
        req.session.user.signed = false;
        res.redirect("/");
    });
});

// ***************** STAR *********************

router.get('*', (req, res) => {
    res.redirect("/");
});



module.exports = router;
