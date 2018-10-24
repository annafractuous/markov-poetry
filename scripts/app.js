class App {
    constructor() {
        this.dictionary     = dictionary     // JSONP variable loaded via script tag
        this.dictionaryKeys = Object.keys(this.dictionary)
        this.suggestionEls  = document.getElementsByClassName('suggestion-field')
        this.composition    = document.getElementById('composition-field')
        this.input          = document.getElementById('initial-input')
        this.restartBtn     = document.getElementById('restart-btn')
        this.refreshBtn     = document.getElementById('refresh-btn')
        this.backBtn        = document.getElementById('back-btn')
        this.defaultText    = this.composition.innerText
        this.firstWord      = true

        this.addListeners()
        console.log(dictionary)
    }

    addListeners() {
        this.activeListener()
        this.inactiveListener()
        this.typingListener()
        this.backspaceListener()
        this.selectionListener()
        this.buttonListeners()
    }

    activeListener() {
        this.input.addEventListener('click', () => this.clearDefaultText())
    }
    
    inactiveListener() {
        window.addEventListener('click', (e) => this.replaceDefaultText(e))
    }

    typingListener() {
        this.input.addEventListener('input', (e) => this.beginComposition(e))
    }

    backspaceListener() {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 8 && !this.firstWord) {
                this.deleteLastWord()
            }
        })
    }

    selectionListener() {
        [...this.suggestionEls].forEach((el) => {
            el.addEventListener('click', (e) => this.updateComposition(e))
        })
    }

    buttonListeners() {
        this.restartBtn.addEventListener('click', () => this.restartComposition())
        this.refreshBtn.addEventListener('click', () => this.refreshSuggestions())
        this.backBtn.addEventListener('click', () => this.deleteLastWord())
    }

    clearDefaultText() {
        if (this.input.value == '') {
            this.composition.innerText = ''
        }
    }

    replaceDefaultText(e) {
        if (e.target.id !== 'initial-input' && this.input.value == '') {
            this.composition.innerText = this.defaultText
        }
    }

    beginComposition(e) {
        let word 
        
        word = e.target.value
        word = word.split(' ')[0]
        word = word.trim().toLowerCase()

        this.composition.innerText = word
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

    refreshSuggestions() {
        const lastWord = this.getLastWord()
        this.getSuggestions(lastWord)
    }

    clearSuggestions() {
        [...this.suggestionEls].forEach((suggestion) => {
            suggestion.innerText = ''
        })
    }

    getLastWord() {
        const words = this.composition.innerText.split(' ')
        const lastIdx = words.length - 1

        return words[lastIdx]
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
        
        this.toggleButtonsState(false)
    }

    toggleButtonsState(disabledState) {
        [this.restartBtn, this.refreshBtn, this.backBtn].forEach((btn) => {
            disabledState ? btn.classList.add('disabled') : btn.classList.remove('disabled')
        })
    }

    deleteLastWord() {
        const words = this.composition.innerText.split(' ')

        words.pop()

        if (words.length) {
            this.composition.innerText = words.join(' ')
            this.refreshSuggestions()
        } else {
            this.restartComposition()
        }
    }

    restartComposition() {
        this.input.disabled = false
        this.input.value = ''
        this.input.focus()

        this.composition.innerText = ''
        this.firstWord = true

        this.clearSuggestions()
        this.toggleButtonsState(true)
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