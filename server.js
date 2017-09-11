const express = require("express");
const app = express();
const router = require("./routes/router");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const hb = require('express-handlebars');
const csrf = require('csurf');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

app.use(session({
    store: new RedisStore({ url: process.env.REDIS_URL || "localhost:8080" }),
    secret: 'street catz'
}));

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(bodyParser());
app.use(csrf({ cookie: true }));
app.use(express.static(__dirname + '/public'));
app.use(router);


app.listen(process.env.PORT || 8080, () => console.log("im listening"));
