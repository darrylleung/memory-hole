const notification = {
    data() {
        return {};
    },
    mounted() {
        console.log("notifications component mounted.");
    },
    template: `
    <button class="notification" @click="refresh">
    🚨
    </button>
    `,
    methods: {
        refresh() {
            this.$emit("refresh");
        },
    },
};
export default notification;
