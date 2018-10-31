const isDebug = true;

function log() {
    console.log.apply(this, arguments);
}

function releaseLog() {
}

function error() {
    console.error.apply(this, arguments);
}

module.exports = {
    log: isDebug ? log : releaseLog,
    error: error
};
