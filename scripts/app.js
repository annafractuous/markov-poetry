class App {
    constructor() {
        this.dictionary     = dictionary     // JSONP variable loaded via script tag
        this.dictionaryKeys = Object.keys(this.dictionary)
        this.suggestionEls  = document.getElementsByClassName('suggestion-field')
        this.composition    = document.getElementById('composition-field')
        this.input          = document.getElementById('initial-input')
        this.firstWord      = true

        this.initializeFirebase()
        // this.saveTestPoem()
        this.addListeners()
        console.log(dictionary)
    }

    initializeFirebase() {
        this.db = firebase.database()
        this.poems = this.db.ref('poems')

        this.fetchPoems()
    }

    fetchPoems() {
        this.poems.on('value', function(snapshot) {
            console.log(snapshot.val());
        }, function (errorObject) {
            console.log('The read failed: ', errorObject);
        });
    }

    saveTestPoem() {
        const key = this.poems.push().key
        const poem = {}

        poem[key] = {
            poem: 'test2',
            user: 'annafractuous'
        }

        this.poems.update(poem)
    }

    addListeners() {
        this.typingListener()
        this.selectionListener()
        this.backspaceListener()
    }

    typingListener() {
        this.input.addEventListener('keyup', (e) => this.beginComposition(e))
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
            const uniquePossibilities = this.makeUnique(possibilities)

            if (uniquePossibilities.length <= 3) {
                suggestions = uniquePossibilities
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
        this.input.disabled = true
        this.firstWord = false
    }

    deleteLastWord() {
        const currentComposition = this.composition.innerText
        const words = currentComposition.split(' ')

        words.pop()

        this.composition.innerText = words.join(' ')
        this.getSuggestions(words.slice(-1))

        if (!words.length) this.restartComposition()
    }

    restartComposition() {
        this.input.disabled = false
        this.input.value = ''
        this.input.focus()

        this.firstWord = true
    }

    makeUnique(array) {
        return [...new Set(array)]
    }

    getRandomEl(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}

document.addEventListener('DOMContentLoaded', function() {
    MuseMachina = new App();
});