const config = require("../config.json");
//in env { TOKEN , MONGO , SECRET }
//Server
const express = require("express");
const app = express();
const compression = require("compression");
const port = config.CLIENT_PORT || 3001;

const bodyParser = require("body-parser");

//Auth
const session = require("express-session");
const passport = require("passport");
require("./strategies/discord-strategy");
//End Auth

const path = require("path");
const { isAuth } = require("./utils/misc");

//Mongo
require("./backend/mongo/connect");
//End Mongo

//Importing Routes
const authRoute = require("./routes/auth/auth");
const logoutRoute = require("./routes/auth/logout");
//End Importing Routes

app.use(
  session({
    secret: "some random secret",
    cookie: {
      maxAge: 60000 * 60 * 24
    },
    resave: false,
    saveUninitialized: false,
    name: "cute-cat"
  })
);

//Utility
app.set("view engine", "ejs");
app.set("views", path.join(__dirname + "/views/src"));

//Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.enable("trust proxy");

const Discord = require("discord.js");

const client = new Discord.Client();

client.on("ready", () => {
  console.log("Client connected with dashboard.");
});

client.login(process.env.TOKEN);

app.use(bodyParser.json());

app.use(function(req, res, next) {
  req.client = client;
  next();
});

app.use("/support", (req, res) => {
  res.redirect("https://discord.gg/");
});

app.use("/auth", authRoute);
app.use("/logout", isAuth, logoutRoute);
app.use("/", require("./routes/home/home"));
app.use("/dashboard", isAuth, require("./routes/guilds/dashboard"));
app.use("/guild", isAuth, require("./routes/guilds/guild"));
app.use("/user", require("./routes/user/user"));
app.use("/api", require("./routes/utility"));


app.get("*", function(req, res) {
  res.redirect("/");
});

app.listen(port, async function() {
  console.log(`Listen on: ${port}`);
});