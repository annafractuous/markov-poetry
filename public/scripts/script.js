class App {
    constructor() {
        this.dictionary     = dictionary     // JSON variable loaded via script tag
        this.dictionaryKeys = Object.keys(this.dictionary)
        this.suggestionEls  = document.getElementsByClassName('suggestion-field')
        this.composition    = document.getElementById('composition-field')
        this.firstWord      = true

        this.addListeners()
        console.log(dictionary)
    }

    addListeners() {
        this.typingListener()
        this.selectionListener()
        this.backspaceListener()
    }

    typingListener() {
        const input = document.getElementById('initial-input')
        input.addEventListener('keyup', (e) => this.beginComposition(e))
    }

    selectionListener() {
        Array.from(this.suggestionEls).forEach((el) => {
            el.addEventListener('click', (e) => this.updateComposition(e))
        })
    }

    backspaceListener() {
        window.addEventListener('keyup', (e) => {
            if (!this.firstWord && e.keyCode === 8) {
                this.deleteLastWord()
            }
        })
    }

    beginComposition(e) {
        const word = e.target.value
        
        this.composition.innerText = e.target.value
        this.getSuggestions(word)
    }

    getSuggestions(word) {
        const possibilities = this.dictionary[word]
        let suggestions = []
        
        if (possibilities) {
            if (possibilities.length <= 3) {
                suggestions = [...possibilities]
            } else {
                while (suggestions.length < 3) {
                    let suggestion = this.getRandomEl(possibilities)
                    if (!suggestions.includes(suggestion)) suggestions.push(suggestion)
                }
            }   
        }
        
        this.returnSuggestions(suggestions)
    }

    returnSuggestions(suggestions) {
        for (let i = 0, l = 3; i < l; i++) {
            if (suggestions[i]) {
                this.suggestionEls[i].innerText = suggestions[i]
            } else {
                this.suggestionEls[i].innerText = ''
            }
        }
    }

    updateComposition(e) {
        const word = e.target.innerText
        
        if (word) {
            this.addToComposition(word)
            this.getSuggestions(word)
            
            if (this.firstWord) this.disableInput()
        }
    }

    addToComposition(word) {
        this.composition.innerText += ' ' + word
    }

    disableInput() {
        const input = document.getElementById('initial-input')
        input.disabled = true;

        this.firstWord = false        
    }

    deleteLastWord() {
        const currentComposition = this.composition.innerText
        const words = currentComposition.split(' ')

        words.pop()

        this.composition.innerText = words.join(' ')
        this.getSuggestions(words.slice(-1))
    }

    getRandomEl(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new App();
});