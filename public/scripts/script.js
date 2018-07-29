class App {
    constructor() {
        this.library     = library     // JSON variable loaded via script tag
        this.libraryKeys = Object.keys(this.library)
        this.resultsEl   = document.getElementById('results')

        this.addListeners()
        console.log(library)
    }

    addListeners() {
        const generateBtn = document.getElementById('generate-btn')
        generateBtn.addEventListener('click', () => this.returnPoem())
    }

    returnPoem() {
        const startingGram = this.getRandomEl(this.libraryKeys)
        const poemLength = 50

        const poem = this.generatePoem(startingGram, poemLength)
        
        this.resultsEl.innerText = poem
    }

    generatePoem(startingGram, poemLength) {
        let poem, currentGram, nextGram

        poem = Array(startingGram)
        currentGram = startingGram
        
        for (let i = 1; i < poemLength; i++) {
            if (!this.library[currentGram]) break

            nextGram = this.getRandomEl(this.library[currentGram])
            poem.push(nextGram)
            currentGram = poem.slice(-1)
        }

        return poem.join(' ')
    }

    getRandomEl(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new App();
});