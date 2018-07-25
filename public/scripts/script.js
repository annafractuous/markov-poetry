var App = {
    init: function() {
        this.library = library;     // JSON variable loaded via script tag
        console.log(library);
    },
}

document.addEventListener('DOMContentLoaded', function() {
    App.init();
});