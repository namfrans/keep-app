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
const { author } = require('./models/Note.js');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const MONGODB_USERNAME = process.env['MONGODB_USERNAME'];
const MONGODB_PASSWORD = process.env['MONGODB_PASSWORD'];
const DATABASE = process.env['DATABASE'];
let currentUser = {};

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

//Middleware
app.use(session({
    secret:"codeninjashelby",
    resave:true,
    saveUninitialized:false,
    cookie:{
        expires:60000
    }
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
    console.log(currentUser);
    next();
});

//Routes
router.get(
    "/auth/google",
    passport.authenticate("google", {
        failureRedirect:"/login/failed",
        scope: ["profile"]
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
//save added note
app.post('/notes', (req, res) =>{
        console.log(req.user);
        const note = new Note({
            title: req.body.title,
            content: req.body.content,
            author:req.user._id
        });

        //search for user and add note to user on mongodb
        if (!req.user) {
            res.status(403).json({ error: true, message: "Not Authorized" });
            return;
        }

        note.save((err, savedNote) => {
            if (err) {
                res.status(500).json({ error: true, message: err });
            } else {
                res.status(200).json({ error: false, message: "Note added", data: savedNote });
            }
        });
        res.redirect(process.env['CLIENT_URL']);
    }
);

//get added notes
app.get('/notes/show',
    (req, res) =>{
        if (!req.user) {
            res.status(403).json({ error: true, message: "Not Authorized" });
            return;
        }
        //find user saved notes
        Note.find({ author: req.user._id }, (err, notes) => {
            if (err) {
                res.status(500).json({ error: true, message: err });
            } else {
                res.status(200).json({ error: false, message: "Notes retrieved", data: notes });
            }
        });
    }
);
//delete selected note
app.delete("/notes/:noteId",
    (req, res) =>{
        if (!req.user) {
            res.status(403).json({ error: true, message: "Not Authorized" });
            return;
        }
        Note.findOneAndDelete({ id: req.params.noteId, author: req.user._id }, (err, deletedNote) => {
            if (err) {
                res.status(500).json({ error: true, message: err });
            } else if (!deletedNote) {
                res.status(404).json({ error: true, message: "Note not found" });
            } else {
                res.status(200).json({ error: false, message: "Note deletion success", data:deletedNote})
            }
        })
        res.redirect(process.env['CLIENT_URL']);
    }
)
//outh callback
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