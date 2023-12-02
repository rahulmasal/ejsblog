//jshint esversion: 6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const _ = require("lodash");

const app = express();
app.set("views", __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget mi proin sed libero enim sed faucibus turpis. Et malesuada fames ac turpis egestas. Massa tempor nec feugiat nisl pretium fusce id. Donec enim diam vulputate ut pharetra sit amet aliquam id. Tincidunt augue interdum velit euismod in. Tincidunt arcu non sodales neque sodales ut etiam sit amet. Non nisi est sit amet facilisis magna. Nunc lobortis mattis aliquam faucibus purus in massa. Volutpat diam ut venenatis tellus in metus vulputate eu scelerisque. Montes nascetur ridiculus mus mauris vitae. Purus sit amet volutpat consequat mauris nunc. Cursus in hac habitasse platea dictumst.";

const aboutContent = "Pellentesque consectetur congue tempus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam erat volutpat. Cras ac hendrerit neque. Cras eu maximus tellus, sed facilisis justo. Sed sed congue lacus. Cras semper rhoncus ex, vel laoreet justo efficitur nec. Mauris facilisis accumsan nulla, eu euismod nisi eleifend quis";

const contactContent = "Donec sed tellus in augue semper laoreet. Maecenas eleifend augue sed odio porttitor, vitae dignissim eros pharetra. Nulla justo turpis, ornare sit amet nisi vel, euismod semper elit. Nunc nec elit vitae nunc imperdiet finibus scelerisque nec erat. Pellentesque tempus pellentesque magna nec luctus. Praesent et faucibus ante, ut ultrices nunc.";


const mongoose = require('mongoose');

// const connectionString = 'mongodb://localhost:27017/blogDB';
const connectionString = process.env.MONGO_CONNECTION_STRING;

mongoose.connect(connectionString, { family: 4 })

    .then(() => {

        console.log('Connected to MongoDB');

    })

    .catch((err) => {

        console.log(err);

    });

// let posts = [];


const postSchema = {
    title: String,
    content: String
}

const Post = mongoose.model("Post", postSchema);




app.get("/", function (req, res) {
    Post.find({}).then(function (posts) {
        res.render('home', { startingContent: homeStartingContent, posts: posts });

    })
        .catch(function (err) {
            console.log(err);
            res.status(500).send('Error');

        });
    // res.render("home", { startingContent: homeStartingContent, posts: posts });
    // console.log(posts);
});


app.get("/about", function (req, res) {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
    res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
    res.render("compose");
});

app.post("/compose", function (req, res) {
    // console.log(req.body.postTitle);

    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody,
    });
    post.save().then(() => {

        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).send('Error');

    });

});

// app.get("/posts/:postName", function (req, res) {
//     // console.log(req.params.postName);
//     const requestedTitle = _.lowerCase(req.params.postName);
//     posts.forEach(function (post) {
//         const storedTitle = _.lowerCase(post.title);
//         if (storedTitle === requestedTitle) {
//             // console.log("match found");
//             res.render("post", { title: post.title, content: post.content });
//         }
//     });
// });

app.get('/posts/:postId', async function (req, res) {
    const requestedPostId = req.params.postId;
    try {
        const post = await Post.findOne({ _id: requestedPostId });
        if (post) {
            res.render('post', {
                title: post.title,
                content: post.content
            });
        } else {
            res.status(404).render('404');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error');
    }
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log("server is running on port 3000");
});
// app.listen(3000, function () {
//     console.log("server is running on port 3000");
// });