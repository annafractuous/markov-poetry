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
        var words = this.formatText(text);
        var grams = {};
        var order = 2;

        for (var i = 0, l = words.length; i < l - order; i++) {
            var gram, nextWord;

            if (words[i].match(/\.|\?|;|!/)) continue;
            
            gram = words.slice(i, i + order).join(' ');
            gram = this.stripPunctuation(gram);

            nextWord = words[i + order];
            nextWord = this.stripPunctuation(nextWord);
            
            if (!grams[gram]) grams[gram] = [];

            grams[gram].push(nextWord);
        }

        console.log(grams);
    },

    formatText(text) {
        text = text.replace(/[^\sA-Za-z;.!?'"‘’“”]+/g, '');
        text = text.replace(/\s{2,}/g, ' ');
        
        return text.split(' ');
    },
    
    stripPunctuation(text) {
        return text.replace(/[;.!?"‘’“”]*/g, '');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});