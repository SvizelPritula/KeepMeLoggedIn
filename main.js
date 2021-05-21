const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "view"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    try {
        var cookie = req.cookies.user;

        var data = JSON.parse(cookie);

        var name = data.name;
        var stay = data.stay;

        if (typeof name == "string" && typeof stay == "boolean") {
            req.user = {
                name, stay
            };
        } else {
            req.user = null;
        }
    } catch {
        req.user = null;
    }

    next();
});

app.use("/static", express.static(path.join(__dirname, "static")));

app.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/dashboard', (req, res) => {
    if (req.user == null) {
        res.redirect(302, "/login");
        return;
    }

    res.render('dashboard', { user: req.user });
});

app.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

app.post('/login', (req, res) => {
    if (req.body == null) {
        res.sendStatus(400);
        return;
    }

    var name = req.body.username;
    var password = req.body.password;
    var stay = req.body.stay == "on";

    if (typeof name != "string" || typeof password != "string") {
        res.sendStatus(400);
        return;
    }

    if (name.length > 32) {
        res.sendStatus(400);
        return;
    }

    res.cookie("user", JSON.stringify({ name, stay }), {
        httpOnly: true
    });

    res.redirect(303, "/");
});

app.post('/logout', (req, res) => {
    if (req.user && !req.user.stay) {
        res.clearCookie("user");
    }

    res.redirect(303, "/");
});

app.post('/things', (req, res) => {
    res.redirect(303, "/dashboard");
});

app.listen(process.env.PORT ?? 80);