function info(text) {
    console.log(`snackbear.info - ${text}`);
    if (this.callback !== undefined) {
        this.callback(text);
    }
}

function error(text) {
    console.log(`snackbear.error - ${text}`);
    if (this.callback !== undefined) {
        this.callback(text);
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