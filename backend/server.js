require('dotenv').config();
const userSchema = require("./models/User.js");
const noteSchema = require("./models/Note.js");
const lodash = require("lodash");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const router = require("express").Router();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { redirect } = require("react-router-dom");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const MONGODB_USERNAME = process.env['MONGODB_USERNAME'];
const MONGODB_PASSWORD = process.env['MONGODB_PASSWORD'];
const DATABASE = process.env['DATABASE'];
var currentUser = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', true);

mongoose.connect(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@webdev.ysfzx8o.mongodb.net/${DATABASE}`, {useNewUrlParser: true});

const User = mongoose.model("User", userSchema);
const Note = mongoose.model("Note", noteSchema);

passport.use(
    new GoogleStrategy({
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: "/auth/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        scope: ['profile'],
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        User.findOne({ googleId: profile.id }).then(exsitingUser => {
            if (exsitingUser) {
                done(null, exsitingUser);
            } else {
                new User({
                    googleId: profile.id,
                    Name: profile.displayName,
                    profilePic: profile['_json'].picture
                })
                .save()
                .then(user => done(null, user));
            }
        });
    })
)

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) => {
        done(err, user);
      });
});


app.use(session({
    secret:"codeninjashelby",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(
  cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true,
  })
)

app.use((req, res, next) => {
    const user = req.user;
    currentUser = user;
    next();
});

//Routes
router.get(
    "/auth/google",
    passport.authenticate("google", {
        failureRedirect:"/login/failed",
        scope: ["profile", "email"]
    })
)

router.get("/auth/google/callback", passport.authenticate("google"));

//logout with callback
app.get("/logout", (req, res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        }
        res.redirect(process.env['CLIENT_URL']);
    });
})

app.get("/login/success", (req, res)=>{
    if(req.user){
        res.status(200).json(
            {
                error:false,
                message:"Successfully loged in",
                user: req.user,
            }
            )
    }else{
        res.status(403).json({error:true, message: "Not Authorized"});
    }
})

app.get("/login/failed", (req, res)=>{
    res.status(401).json({
        error:true,
        message:"Log in failure"
    })
})
//Notes operations  
app.get('/notes',
    (req, res) =>{
        const userId = req.body.userId;
        const note = new Note({
            title: req.body.title,
            content: req.body.content
        });

        //search for user and add note to user on mongodb
        User.findOneAndUpdate({ googleId: userId }, { $push: { notes: note } },
            (err, doc) => {
                if (err) {
                    console.log("Something went wrong adding note!");
                }
                console.log(doc);
            }
        )
    }
);

app.post('/users/notes',
    (req, res) =>{
        //find loggedin user from mongodb
        const userId = currentUser['googleId'];
        //find user
        User.findOne({ googleId: userId }, (err, user) => {
            if (!err) {
                res.send(user);
            } else {
                console.log(err);
            }
        });
    }
);
app.get("/notes/:noteId",
    (req, res) =>{
        const noteToDelete = req.params.noteId;
        const userId = currentUser['googleId'];
        User.findOneAndUpdate({googleId:userId},{$pull: {notes:{id: noteToDelete}}}, (err, noteFound)=>{
            if(!err){
                res.redirect(process.env['CLIENT_URL']);
            }
        })
    }
)

app.get("/auth/google/callback",
    passport.authenticate("google"),
    async (req, res) => {
        res.redirect(process.env['CLIENT_URL']);
    }
);

app.get("/logout", (req, res)=>{
    req.logout();
    res.redirect(process.env['CLIENT_URL']);
})

//port
let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, ()=>{
  console.log(`Server running on port ${port}`);
});