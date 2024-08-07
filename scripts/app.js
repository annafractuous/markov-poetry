throttle = require('lodash.throttle')

class MuseMachina {
	constructor() {
		this.saveSelectors()
		this.saveListenerCallbacks()
		this.addListeners()

		this.dictionary = dictionary     // JSONP variable loaded via script tag
		this.dictionaryKeys = Object.keys(this.dictionary)
		this.defaultText = this.composition.innerText
		this.firstWord = true
		this.dbInitialized = false
		this.museumLoaded = false
		this.poemsPerPage = 20
	}

	saveSelectors() {
		this.activePage = document.querySelector('.active-page')
		this.activeNav = document.querySelector('.active-nav-item')
		this.suggestionEls = document.getElementsByClassName('suggestion-field')
		this.composition = document.getElementById('composition-field')
		this.input = document.getElementById('initial-input')
		this.startBtn = this.suggestionEls[1]
		this.restartBtn = document.getElementById('restart-btn')
		this.backBtn = document.getElementById('back-btn')
		this.saveBtn = document.getElementById('save-btn')
		this.shareBtn = document.getElementById('share-btn')
		this.fbBtn = document.getElementById('share-fb-btn')
		this.twitterBtn = document.getElementById('share-twitter-btn')
		this.shareBtns = document.getElementById('share-btns')
		this.dbSaveBtn = document.getElementById('db-save-btn')
		this.museumEntries = document.getElementById('museum-entries')
	}

	saveListenerCallbacks() {
		this.startCallback = () => this.start()
		this.selectionCallback = (e) => this.updateComposition(e)
		this.museumScrollCallback = throttle(() => this.museumLoadMore(), 1000)
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
		overlay.addEventListener('click', () => this.toggleSaveDialogue())
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
		enabled ? this.startBtn.addEventListener('click', this.startCallback) : this.startBtn.removeEventListener('click', this.startCallback)
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

	scrollListener(enabled) {
		enabled ? window.addEventListener('scroll', this.museumScrollCallback) : window.removeEventListener('scroll', this.museumScrollCallback)
	}

	buttonListeners() {
		this.restartBtn.addEventListener('click', () => this.restartComposition())
		this.backBtn.addEventListener('click', () => this.deleteLastWord())
		this.saveBtn.addEventListener('click', () => this.toggleSaveDialogue())
		this.shareBtn.addEventListener('click', () => this.toggleShareButtons())
		this.fbBtn.addEventListener('click', () => this.shareToFB())
		this.twitterBtn.addEventListener('click', () => this.shareToTwitter())
		this.dbSaveBtn.addEventListener('click', () => this.savePoem())
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
		this.fetchPoems(true)
		this.scrollListener(true)

		this.museumLoaded = true
	}

	initializeFirebase() {
		this.db = firebase.database()
		this.poemsDB = this.db.ref('poems')
		debugger

		this.dbInitialized = true
	}

	fetchPoems(firstPage) {
		const query = firstPage ? this.poemsDB : this.poemsDB.orderByKey().endAt(this.lastPoem)

		query.limitToLast(this.poemsPerPage + 1).on('value', (snapshot) => {
			this.processPoems(snapshot.val(), firstPage)
		}, (errorObject) => {
			console.log('The read failed: ', errorObject)
		})
	}

	processPoems(data) {
		const keys = Object.keys(data)
		const noMorePoems = keys.length < this.poemsPerPage
		const poems = noMorePoems ? Object.values(data) : Object.values(data).slice(1)

		if (noMorePoems) this.scrollListener(false)
		this.lastPoem = keys[0]

		this.displayPoems(poems)
	}

	displayPoems(poems) {
		poems = poems.reverse()
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

	museumLoadMore() {
		if (this.activePage.id === 'museum-page') {
			const distanceFromBottom = this.museumEntries.getBoundingClientRect().bottom - window.innerHeight
			if (distanceFromBottom <= window.innerHeight) this.fetchPoems()
		}
	}

	savePoem() {
		const poem = this.composition.innerText
		const penname = document.getElementById('penname').value

		if (!this.dbInitialized) this.initializeFirebase()
		this.savePoemToDB(poem, penname)

		this.toggleSaveDialogue()
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

	toggleButtonsState(enabledState) {
		[this.restartBtn, this.backBtn, this.saveBtn, this.shareBtn].forEach((btn) => {
			enabledState ? btn.classList.remove('disabled') : btn.classList.add('disabled')
		})
	}

	toggleSaveDialogue() {
		document.body.classList.toggle('dialogue-open')
	}

	toggleShareButtons() {
		this.shareBtns.classList.toggle('expanded')
	}

	clearDefaultText() {
		if (this.input.value === '') {
			this.composition.innerText = ''
		}
	}

	replaceDefaultText(e) {
		if (e.target.id !== 'initial-input' && this.input.value === '') {
			this.composition.innerText = this.defaultText
		}
	}

	/* SHARING /------- */

	shareToFB() {
		const encodedPoem = encodeURI(this.composition.innerText)
		window.open(`https://www.facebook.com/dialog/share?app_id=344145906430055&display=popup&href=https%3A%2F%2Fmusemachina.com&quote=${encodedPoem}`, '_blank')

		this.toggleShareButtons()
	}

	shareToTwitter() {
		const text = `"${this.composition.innerText}" | composing computer poetry at https://musemachina.com`
		const encoded = encodeURI(text)
		window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank')

		this.toggleShareButtons()
	}

	/* UTILS /------- */

	makeUnique(array) {
		return [...new Set(array)]
	}

	getRandomEl(array) {
		return array[Math.floor(Math.random() * array.length)]
	}
}

document.addEventListener('DOMContentLoaded', function () {
	MuseMachina = new MuseMachina()
})