class App {
    constructor() {
        this.dictionary     = dictionary     // JSON variable loaded via script tag
        this.dictionaryKeys = Object.keys(this.dictionary)
        this.suggestionEls  = document.getElementsByClassName('suggestion-field')
        this.composition    = document.getElementById('composition-field')

        this.addListeners()
        console.log(dictionary)
    }

    addListeners() {
        const input = document.getElementById('input')
        input.addEventListener('keyup', (e) => this.offerSuggestions(e))

        Array.from(this.suggestionEls).forEach((el) => {
            el.addEventListener('click', (e) => this.addToComposition(e))
        })
    }

    offerSuggestions(e) {
        const word = e.target.value
        this.getSuggestions(word)
    }

    getSuggestions(word) {
        const possibilities = this.dictionary[word]
        if (possibilities) {
            let suggestions = []

            if (possibilities.length <= 3) {
                suggestions = [...possibilities]
            } else {
                while (suggestions.length < 3) {
                    let suggestion = this.getRandomEl(possibilities)
                    if (!suggestions.includes(suggestion)) suggestions.push(suggestion)
                }
            }
            
            this.returnSuggestions(suggestions)
        } else {
            this.clearSuggestions()
        }
    }

    returnSuggestions(suggestions) {
        for (let i = 0, l = suggestions.length; i < l; i++) {
            this.suggestionEls[i].innerText = suggestions[i]
        }
    }

    clearSuggestions() {
        for (let i = 0, l = 3; i < l; i++) {
            this.suggestionEls[i].innerText = ''
        }
    }

    addToComposition(e) {
        const word = e.target.innerText
        if (word) {
            this.composition.innerText += word
        }
    }

    getRandomEl(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new App();
});