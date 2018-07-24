var App = {
    init: function() {
        this.loadCorpus();
    },

    loadCorpus: function() {
        var req = new XMLHttpRequest();

        req.onload = function() {
            var text = req.response;
            App.createLibrary(text);
        }
        req.open('GET', 'public/data/text.txt');
        req.send();
    },

    createLibrary(text) {
        console.log(text);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});