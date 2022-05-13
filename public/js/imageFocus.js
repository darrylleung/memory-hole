import comments from "./comments.js";

const imageFocus = {
    data() {
        return {
            image: [],
            loading: true,
        };
    },
    components: {
        comments: comments,
    },
    props: ["imageId"],
    mounted() {
        console.log("imageFocus component mounted.");

        setTimeout(
            fetch(`/images/${this.imageId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    if (data.success == false) {
                        console.log("should close the modal");
                        this.$emit("doesNotExist");
                    } else {
                        this.image = data;
                        this.loading = false;
                    }
                })
                .catch((err) => {
                    console.log("error: ", err);
                }),
            2000
        );
    },
    template: `
    <div v-if="loading">
        <div class="loading">
            
        </div>
    </div>
    <div v-else class="imageFocusContainer">
        <img class="focusedImage" :src="image.url">
        <div class="focusedText">
            <div class="focusedTextTitle">
                <span class="title">{{image.title}}</span><span class="username"> by {{image.username}}</span>
                <p class="description">{{image.description}}</p>
            </div>
                <comments :image-id="this.imageId"></comments>
            <div>
            </div>
        </div>
    </div>
    `,
    methods: {},
};

export default imageFocus;
