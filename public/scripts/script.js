class App {
    constructor() {
        this.saveSelectors()
        this.addListeners()

        this.dictionary     = dictionary     // JSONP variable loaded via script tag
        this.dictionaryKeys = Object.keys(this.dictionary)
        this.defaultText    = this.composition.innerText
        this.firstWord      = true
        this.museumLoaded   = false

        console.log(dictionary)
    }

    saveSelectors() {
        this.activePage    = document.querySelector('.active-page')
        this.activeNav     = document.querySelector('.active-nav-item')
        this.suggestionEls = document.getElementsByClassName('suggestion-field')
        this.composition   = document.getElementById('composition-field')
        this.input         = document.getElementById('initial-input')
        this.restartBtn    = document.getElementById('restart-btn')
        this.backBtn       = document.getElementById('back-btn')
        this.museumEntries = document.getElementById('musem-entries')
        // this.refreshBtn    = document.getElementById('refresh-btn')
    }

    addListeners() {
        this.navListener()
        this.activeListener()
        this.inactiveListener()
        this.typingListener()
        this.backspaceListener()
        this.selectionListener()
        this.buttonListeners()
    }

/* LISTENERS /------- */

    navListener() {
        const navItems = document.querySelectorAll('.nav-list-item')
        navItems.forEach((el) => {
            el.addEventListener('click', (e) => this.clickNavItem(e))
        })
    }

    activeListener() {
        this.input.addEventListener('click', () => this.clearDefaultText())
    }

    inactiveListener() {
        window.addEventListener('click', (e) => this.replaceDefaultText(e))
    }

    typingListener() {
        this.input.addEventListener('input', (e) => this.readInput(e))
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
        this.backBtn.addEventListener('click', () => this.deleteLastWord())
        // this.refreshBtn.addEventListener('click', () => this.refreshSuggestions())
    }

/* NAVIGATION /------- */

    clickNavItem(e) {
        const pageSelection = e.currentTarget.dataset.page
        const nextPage = document.getElementById(pageSelection)

        if (nextPage !== this.activePage) {
            if (!this.museumLoaded && nextPage.id === 'museum-page') this.loadMuseum()
            
            this.navigate(nextPage)
            this.updateActiveNav(pageSelection)
        }
    }

    navigate(nextPage) {
        this.activePage.classList.add('slide-out')
        nextPage.classList.add('slide-in')

        setTimeout(() => {
            this.activePage.classList.remove('active-page')
            this.activePage.classList.remove('slide-out')
            nextPage.classList.add('active-page')
            nextPage.classList.remove('slide-in')
            
            this.activePage = nextPage
        }, 300)     // 300ms = sliding transition speed
    }

    updateActiveNav(pageSelection) {
        const nextNav = document.querySelector('[data-page=' + pageSelection)
        
        this.activeNav.classList.remove('active-nav-item')
        nextNav.classList.add('active-nav-item')

        this.activeNav = nextNav
    }

/* INPUT /------- */

    readInput(e) {
        let word

        word = e.target.value
        word = word.split(' ')[0]
        word = word.trim().toLowerCase()

        this.composition.innerText = word

        this.getSuggestions(word)

        const buttonsDisabled = !word.length
        this.toggleButtonsState(buttonsDisabled)
    }

    disableInput() {
        this.input.disabled = true
        this.firstWord = false
    }

    enableInput() {
        this.input.disabled = false
        this.input.value = ''
        this.input.focus()

        this.firstWord = true
    }

/* COMPOSITION /------- */

    updateComposition(e) {
        const word = e.target.innerText

        if (word) {
            this.addNextWord(word)
            this.getSuggestions(word)

            if (this.firstWord) {
                this.disableInput()
            }
        }
    }

    addNextWord(word) {
        this.composition.innerText += ' ' + word
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

    getLastWord() {
        const words = this.composition.innerText.split(' ')
        const lastIdx = words.length - 1

        return words[lastIdx]
    }

    restartComposition() {
        this.composition.innerText = ''

        this.enableInput()
        this.clearSuggestions()
        this.toggleButtonsState(true)
    }

/* SUGGESTIONS /------- */

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

/* MUSEUM /------- */

    loadMuseum() {
        this.initializeFirebase()
        this.fetchPoems()

        this.museumLoaded = true
    }
    
    initializeFirebase() {
        this.db = firebase.database()
        this.poemsDB = this.db.ref('poems')
    }

    fetchPoems() {
        // TO DO: 
        // // 1. paginate or lazy-load the museum, loading 20 at a time
        // // 2. save the first 20 to localStorage
        this.poemsDB.limitToLast(20).on('value', (snapshot) => {
            this.displayPoems(snapshot.val())
        }, (errorObject) => {
            console.log('The read failed: ', errorObject)
        })
    }

    displayPoems(poems) {
        poems = Object.values(poems).reverse()
        poems.forEach((poem) => this.displayPoem(poem))
    }

    displayPoem(poem) {
        const html = `
            <div class="museum-entry">
                <p class="poem-text">${poem.poem}</p>
                <p class="poem-composer">${poem.user}</p>
            </div>
        `
        this.museumEntries.innerHTML += html
    }

    savePoem(poem, user) {
        const key = this.poemsDB.push().key
        const data = {}

        data[key] = {
            poem: poem,
            user: user
        }

        this.poemsDB.update(data)
    }

/* UI STATES /------- */

    toggleButtonsState(disabledState) {
        // [this.restartBtn, this.refreshBtn, this.backBtn].forEach((btn) => {
        [this.restartBtn, this.backBtn].forEach((btn) => {
            disabledState ? btn.classList.add('disabled') : btn.classList.remove('disabled')
        })
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

/* UTILS /------- */

    makeUnique(array) {
        return [...new Set(array)]
    }

    getRandomEl(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}

document.addEventListener('DOMContentLoaded', function() {
    MuseMachina = new App()
})