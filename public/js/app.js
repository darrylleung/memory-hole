import * as Vue from "./vue.js";
import imageFocus from "./imageFocus.js";
import upload from "./upload.js";
import notification from "./notification.js";

Vue.createApp({
    data() {
        return {
            title: "MEMORY HOLE",
            images: [],
            selectedImage: !isNaN(parseInt(location.pathname.slice(1)))
                ? location.pathname.slice(1)
                : null,
            uploadStatus: false,
            bottom: false,
            notification: false,
        };
    },
    components: {
        "image-focus": imageFocus,
        upload: upload,
        notification: notification,
    },
    mounted() {
        console.log("My Vue app is mounted.");

        if (this.selectedImage === null) {
            history.replaceState({}, "", "/");
        }

        window.addEventListener("popstate", () => {
            console.log("user used forward or backward button!");
            this.selectedImage = location.pathname.slice(1);
        });

        this.loadImages();

        window.onscroll = () => {
            console.log("The window is scrolling");
            let bottomOfWindow =
                document.documentElement.scrollTop +
                    document.documentElement.offsetHeight >=
                document.documentElement.scrollHeight;

            if (bottomOfWindow) {
                console.log("We've reached the bottom");
                this.getMoreImages();
                this.bottom = true;
            }
        };

        setInterval(this.checkForNewImages, 5000);
    },

    methods: {
        loadImages() {
            fetch("/images")
                .then((resp) => resp.json())
                .then(({ rows }) => {
                    this.images = rows;
                    this.notification = false;
                    console.log("images loaded: ", this.images);
                })
                .catch((err) => {
                    console.log("error: ", err);
                });
        },
        selectImage(imageId) {
            console.log("user selected an image");
            console.log("selected imageId: ", imageId);
            this.selectedImage = imageId;
            history.pushState({}, "", imageId);
        },
        getMoreImages() {
            console.log("user is scrolling");
            let lastId = this.images[this.images.length - 1].id;

            fetch(`/moreimages/${lastId}`)
                .then((resp) => resp.json())
                .then((moreImages) => {
                    let nextBatch = moreImages.rows;
                    this.images = [...this.images, ...nextBatch];
                })
                .catch((err) => console.log("error: ", err));
        },
        upload() {
            console.log("user is trying to upload!");
            if (!this.uploadStatus) {
                this.uploadStatus = true;
            } else {
                this.uploadStatus = false;
            }
        },
        removeOverlay() {
            console.log("I detect a click!");
            this.uploadStatus = false;
            this.selectedImage = false;
            history.pushState({}, "", "/");
        },
        closeOut() {
            this.uploadStatus = false;
            this.selectedImage = false;
            history.replaceState({}, "", "/");
        },
        addImage(uploadedImage) {
            console.log("user is trying to add an image");
            this.images.unshift(uploadedImage);
        },
        memoryHole() {
            let fileUpload = document.querySelector(".fileUpload");
            fileUpload.classList.add("memoryHole");
            fileUpload.addEventListener("animationend", () => {
                this.uploadStatus = false;
                this.selectedImage = false;
            });
        },
        checkForNewImages() {
            fetch("/images")
                .then((resp) => resp.json())
                .then(({ rows }) => {
                    console.log("images loaded: ", rows);
                    console.log("latest loaded image: ", this.images[0].id);
                    if (rows[0].id > this.images[0].id) {
                        this.notification = true;
                    }
                })
                .catch((err) => {
                    console.log("error: ", err);
                });
        },
    },
}).mount("#main");
