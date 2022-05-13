const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

exports.uploadImages = (username, title, description, fullUrl) => {
    return db.query(
        `INSERT INTO images (username, title, description, url)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, title, description, url`,
        [username, title, description, fullUrl]
    );
};

exports.popImages = () => {
    return db.query(`SELECT * FROM images
    ORDER BY id DESC
    LIMIT 8`);
};

exports.getImage = (imageId) => {
    return db.query(
        `SELECT id, url, title, description, username
    FROM images
    WHERE id = $1`,
        [imageId]
    );
};

exports.getMoreImages = (lastId) => {
    return db.query(
        `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 8`,
        [lastId]
    );
};

// exports.getImageComments = (imageId) => {
//     return db.query(
//         `SELECT id, comment, username, imageID, date(created_at) FROM comments
//         WHERE imageId = $1`,
//         [imageId]
//     );
// };

exports.getImageComments = (imageId) => {
    return db.query(
        `SELECT * FROM comments
        WHERE imageId = $1`,
        [imageId]
    );
};

exports.addNewComment = (username, comment, imageId) => {
    return db.query(
        `INSERT INTO comments (username, comment, imageId)
        VALUES ($1, $2, $3)
        RETURNING username, comment, created_at`,
        [username, comment, imageId]
    );
};
