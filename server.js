const express = require("express");
const app = express();
const db = require("./db");
const { uploader } = require("./upload");
const s3 = require("./s3");
const { DateTime } = require("luxon");

app.use(express.static("./public"));
app.use(express.json());

app.use((req, res, next) => {
    console.log("req.url: ", req.url);
    return next();
});

app.use((req, res, next) => {
    res.set("x-frame-options", "deny");
    next();
});

// this uploads the image to the server and returns the image uploaded to the image grid
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);

    const { username, title, description } = req.body;
    const { filename } = req.file;
    const fullUrl = "https://darryl-bucket-1.s3.amazonaws.com/" + filename;
    console.log("fullUrl: ", fullUrl);

    db.uploadImages(username, title, description, fullUrl)
        .then((result) => {
            // console.log("Result from upload: ", result);
            // console.log("Image object: ", result.rows[0]);
            let uploadedImage = result.rows[0];
            res.json(uploadedImage);
        })
        .catch((err) => {
            console.log("err: ", err);
        });
});

// this populates the images on page load
app.get("/images", (req, res) => {
    console.log("We have contact.");
    db.popImages()
        .then((result) => {
            // console.log(result);
            res.json(result);
        })
        .catch((err) => {
            console.log("err: ", err);
        });
});

// this gets the image selected from the database and returns it
app.get("/images/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getImage(imageId)
        .then(({ rows }) => {
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("error: ", err);
        });
});

app.get("/moreimages/:lastId", (req, res) => {
    const { lastId } = req.params;
    db.getMoreImages(lastId)
        .then((result) => {
            // console.log("result from more images: ", result);
            res.json(result);
        })
        .catch((err) => console.log("error: ", err));
});

app.get("/comments/:imageId", (req, res) => {
    const { imageId } = req.params;
    db.getImageComments(imageId)
        .then((result) => {
            // console.log("get existing comments: ", result.rows);
            for (let i = 0; i < result.rows.length; i++) {
                let newDate = DateTime.fromJSDate(result.rows[i].created_at);
                result.rows[i].created_at = newDate.toLocaleString(
                    DateTime.DATETIME_MED
                );
                // console.log("new dates after parsing: ", newDate);
                // console.log("new comment object: ", result.rows);
            }
            res.json(result);
        })
        .catch((err) => console.log("error: ", err));
});

app.post("/addcomment", (req, res) => {
    console.log("what's in req.body: ", req.body);

    const { username, comment, imageId } = req.body;
    console.log("username: ", username);
    db.addNewComment(username, comment, imageId)
        .then((result) => {
            console.log("Result from add new comment: ", result);
            let date = DateTime.fromJSDate(result.rows[0].created_at);
            result.rows[0].created_at = date.toLocaleString(
                DateTime.DATETIME_MED
            );
            let newComment = result.rows[0];
            // console.log("new comment: ", newComment);
            res.json(newComment);
        })
        .catch((err) => console.log("error: ", err));
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(process.env.PORT || 8080, () => console.log(`I'm listening.`));
