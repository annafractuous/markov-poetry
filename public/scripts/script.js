class App {
    constructor() {
        this.saveSelectors()
        this.saveListenerCallbacks()
        this.addListeners()

        this.dictionary     = dictionary     // JSONP variable loaded via script tag
        this.dictionaryKeys = Object.keys(this.dictionary)
        this.defaultText    = this.composition.innerText
        this.firstWord      = true
        this.dbInitialized  = false
        this.museumLoaded   = false

        console.log(dictionary)
    }

    saveSelectors() {
        this.activePage    = document.querySelector('.active-page')
        this.activeNav     = document.querySelector('.active-nav-item')
        this.suggestionEls = document.getElementsByClassName('suggestion-field')
        this.composition   = document.getElementById('composition-field')
        this.input         = document.getElementById('initial-input')
        this.startBtn      = this.suggestionEls[1]
        this.restartBtn    = document.getElementById('restart-btn')
        this.backBtn       = document.getElementById('back-btn')
        this.saveBtn       = document.getElementById('save-btn')
        this.shareBtn       = document.getElementById('share-btn')
        this.dbSaveBtn     = document.getElementById('db-save-btn')
        this.museumEntries = document.getElementById('musem-entries')
        // this.refreshBtn    = document.getElementById('refresh-btn')
    }

    saveListenerCallbacks() {
        this.startCallback = () => this.start()
        this.selectionCallback = (e) => this.updateComposition(e)
    }

    addListeners() {
        this.overlayListener()
        this.navListener()
        this.activeListener()
        this.inactiveListener()
        this.typingListener()
        this.startListener(true)
        this.backspaceListener()
        this.buttonListeners()
    }

/* LISTENERS /------- */

    overlayListener() {
        const overlay = document.querySelector('.save-poem-overlay')
        overlay.addEventListener('click', () => this.toggleSaveDialogue(false))
    }

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
        this.input.addEventListener('input', (e) => this.type(e))
    }

    startListener(enabled) {
        if (enabled) {
            this.startBtn.addEventListener('click', this.startCallback)
        } else {
            this.startBtn.removeEventListener('click', this.startCallback)
        }
    }

    backspaceListener() {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode === 8 && !this.firstWord) {
                this.deleteLastWord()
            }
        })
    }

    selectionListener(enabled) {
        if (enabled) {
            [...this.suggestionEls].forEach((el) => {
                el.addEventListener('click', this.selectionCallback)
            })
        } else {
            [...this.suggestionEls].forEach((el) => {
                el.removeEventListener('click', this.selectionCallback)
            })
        }
    }

    buttonListeners() {
        this.restartBtn.addEventListener('click', () => this.restartComposition())
        this.backBtn.addEventListener('click', () => this.deleteLastWord())
        this.saveBtn.addEventListener('click', () => this.toggleSaveDialogue(true))
        this.dbSaveBtn.addEventListener('click', () => this.savePoem())
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

    type(e) {
        let word

        word = e.target.value
        word = word.split(' ')[0]
        word = word.trim().toLowerCase()

        this.composition.innerText = word

        this.showStart(!!word.length)
    }

    showStart(show) {
        show ? this.startBtn.classList.add('start-btn') : this.startBtn.classList.remove('start-btn')
    }

    start() {
        this.showStart(false)
        this.startListener(false)
        this.selectionListener(true)
        this.disableInput()
        this.readInput()
    }

    readInput() {
        const word = this.composition.innerText

        this.showSuggestions(word)
        this.toggleButtonsState(true)
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
            this.showSuggestions(word)
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
        this.toggleButtonsState(false)
        this.startListener(true)
    }

/* SUGGESTIONS /------- */

    showSuggestions(word) {
        const suggestions = this.getSuggestions(word)
        this.returnSuggestions(suggestions)
    }

    getSuggestions(word) {
        const possibilities = this.dictionary[word]
        const uniquePossibilities = this.makeUnique(possibilities)
        
        let suggestions = []

        if (uniquePossibilities.length < 3) {
            const defaultsNeeded = 3 - uniquePossibilities.length
            const defaults = this.getDefaults(defaultsNeeded)
            suggestions = [...uniquePossibilities, ...defaults]
        } else if (uniquePossibilities.length === 3) {
            suggestions = uniquePossibilities
        } else {
            while (suggestions.length < 3) {
                let suggestion = this.getRandomEl(possibilities)
                if (!suggestions.includes(suggestion)) suggestions.push(suggestion)
            }
        }

        return suggestions
    }

    getDefaults(defaultsNeeded) {
        const defaults = this.getSuggestions('the')
        return defaults.slice(0, defaultsNeeded)
    }

    returnSuggestions(suggestions) {
        for (let i = 0, l = 3; i < l; i++) {
            this.suggestionEls[i].innerText = suggestions[i]
        }
    }

    refreshSuggestions() {
        const lastWord = this.getLastWord()
        this.showSuggestions(lastWord)
    }

    clearSuggestions() {
        [...this.suggestionEls].forEach((suggestion) => {
            suggestion.innerText = ''
        })
    }

/* MUSEUM /------- */

    loadMuseum() {
        if (!this.dbInitialized) this.initializeFirebase()
        this.fetchPoems()

        this.museumLoaded = true
    }

    initializeFirebase() {
        this.db = firebase.database()
        this.poemsDB = this.db.ref('poems')

        this.dbInitialized = true
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

    savePoem() {
        const poem = this.composition.innerText
        const penname = document.getElementById('penname').value

        if (!this.dbInitialized) this.initializeFirebase()
        this.savePoemToDB(poem, penname)

        this.toggleSaveDialogue(false)
    }

    savePoemToDB(poem, user) {
        const key = this.poemsDB.push().key
        const data = {}

        data[key] = {
            poem: poem,
            user: user
        }

        this.poemsDB.update(data)
    }

/* UI STATES /------- */

    toggleSaveDialogue(open) {
        const body = document.body
        open ? body.classList.add('dialogue-open') : body.classList.remove('dialogue-open')
    }

    toggleButtonsState(enabledState) {
        // [this.restartBtn, this.refreshBtn, this.backBtn].forEach((btn) => {
        [this.restartBtn, this.backBtn, this.saveBtn, this.shareBtn].forEach((btn) => {
            enabledState ? btn.classList.remove('disabled') : btn.classList.add('disabled')
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