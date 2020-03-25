// const nw=require('nw');



// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const startUrl = process.env.NWJS_START_URL || '/../build/index.html';


nw.Window.open(startUrl, {}, function (win) {
    win.maximize()
});
