function info(text) {
    console.log(`snackbear.info - ${text}`);
    if (this.callback !== undefined) {
        this.callback(text);
    } else {
        console.error("snackbear.info - snackbear.init must be called first");
    }
}

function error(text) {
    console.log(`snackbear.error - ${text}`);
    if (this.callback !== undefined) {
        this.callback(text);
    } else {
        console.error("snackbear.error - snackbear.init must be called first");
    }
}

function init(callback) {
    this.callback = callback;
}

export default {
    init,
    info,
    error
}