const comments = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["imageId"],
    mounted() {
        console.log("comments component mounted.");
        console.log("this component's props: ", this.imageId);
        let imageId = this.imageId;

        fetch(`/comments/${imageId}`)
            .then((resp) => resp.json())
            .then((imageComments) => {
                console.log("Received comments: ", imageComments);
                let receivedComments = imageComments.rows;
                this.comments = receivedComments;
            })
            .catch((err) => console.log("error: ", err));
    },
    template: `
        <div class="commentsContainer">
            <div class="comments">
                    <ul v-for="comment in comments.slice().reverse()" :key="imageId">
                    <li>{{comment.comment}}
                    <br>
                    <span class="commenter">by {{comment.username}} at {{comment.created_at}}</span></li>
                </ul>
            </div>
        <input class="commentUsername" v-model="username" autocomplete="off" type="text" name="username" placeholder="Username">
        <input class="comment" v-model="comment" autocomplete="off" type="text" name="comment" placeholder="Please leave a comment...">
        <button @click="submitComment" class="submitComment">SUBMIT</button>
        </div>
    `,
    methods: {
        submitComment() {
            const commentBody = JSON.stringify({
                username: this.username,
                comment: this.comment,
                imageId: this.imageId,
            });

            fetch("/addcomment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: commentBody,
            })
                .then((resp) => resp.json())
                .then((receivedComments) => {
                    // let newComment = receivedComments.rows;
                    console.log("receivedComments: ", receivedComments);
                    this.comments.push(receivedComments);
                    this.resetInput();
                    // this.comments = [...this.comments, ...newComment];
                })
                .catch((err) => console.log("error: ", err));
        },
        resetInput() {
            this.username = "";
            this.comment = "";
        },
    },
};

export default comments;
