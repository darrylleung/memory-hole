const upload = {
    data() {
        return {
            username: "",
            title: "",
            description: "",
            file: null,
            fileOverDropZone: false,
            dropZoneText: "Drag and Drop an Image",
            dropZoneInputText: "Or Choose an Image...",
        };
    },
    props: ["image"],
    mounted() {
        console.log("upload component mounted.");
    },
    template: `
        <div class="fileUpload">
            <div class="dropZone" @drop.prevent="dragFile" @dragover.prevent @dragenter.prevent="fileOverDropZone = true" @dragleave.prevent="fileOverDropZone = false"
        :class="{'fileOver' : fileOverDropZone}"> 
                <p class="drop" :class="{'dragOver' : fileOverDropZone, 'fileOver' : fileOverDropZone}"
                > {{dropZoneText}}</p>
                <input @change="uploadHandler" type="file" name="file" accept="image/*" id="file" class="inputFile" :class="{'dragOver' : fileOverDropZone}">
                <label for="file">{{dropZoneInputText}}</label>
            </div>
            <div class="fileUploadInputs">
                <div class="fileUploadTitleUser">
                    <input class="standard" v-model="username" type="text" name="username" placeholder="Username" autocomplete="off">
                    <input class="standard" v-model="title" name="title" placeholder="Title" autocomplete="off">
                </div>
                <textarea class="description" v-model="description" type="text" name="description" placeholder="Description..." maxlength="120"></textarea>
                <button @click="clickHandler" class="submit">SUBMIT</button>
            </div>
        </div>`,
    methods: {
        clickHandler() {
            const fd = new FormData();
            fd.append("username", this.username);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("file", this.file);

            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((resp) => resp.json())
                .then((uploadedImage) => {
                    console.log("Response: ", uploadedImage);
                    this.resetInput();
                    this.$emit("addImage", uploadedImage);
                    this.$emit("successfulUpload");
                })
                .catch((err) => {
                    console.log("error submitting form fields: ", err);
                });
        },
        resetInput() {
            this.username = "";
            this.title = "";
            this.description = "";
            this.file = "";
        },
        fileSelectHandler(e) {
            this.dropZoneText = "Image Selected!";
            this.dropZoneInputText = "Or Choose Another...";
            this.file = e.target.files[0];
            console.log("this.file: ", this.file);
        },
        dragFile(e) {
            let fileSize = e.dataTransfer.files[0].size;
            if (fileSize > 3000000) {
                this.dropZoneText = "Image Exceeds Size Limit!";
                return;
            } else {
                this.file = e.dataTransfer.files[0];
                this.showInputs();
                this.fileOverDropZone = false;
                this.dropZoneText = "Image Selected!";
                this.dropZoneInputText = "Or Choose Another...";
            }
        },
        showInputs() {
            console.log("show inputs event listener worked!");
            let fileUploadInputs = document.querySelector(".fileUploadInputs");
            console.log("fileUploadInputs: ", fileUploadInputs);
            fileUploadInputs.classList.add("showInputs");
        },
        uploadHandler(e) {
            let fileSize = e.target.files[0].size;
            if (fileSize > 3000000) {
                this.dropZoneText = "Image Exceeds Size Limit!";
                return;
            } else {
                this.fileSelectHandler(e);
                this.showInputs();
            }
        },
    },
};

export default upload;
