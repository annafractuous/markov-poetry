require 'pry-byebug'
require 'json'

class Dictionary
    def initialize(corpora)
        @corpora = corpora
        @dictionary = {}

        create_dictionary
    end

    def create_dictionary
        load_text
        process_text
        save_dictionary
    end

    def load_text
        set_corpus_paths
        read_files
    end

    def set_corpus_paths
        @corpora.map! { |path| "data/#{path}" }
    end

    def read_files
        @corpora.map! do |corpus|
            File.open(corpus) { |f| f.read }
        end
    end

    def process_text
        @corpora.each { |corpus| add_to_dictionary(corpus) }
    end

    def add_to_dictionary(corpus)
        words = normalize_text(corpus).split(' ')
        loop_through(words)
    end

    def normalize_text(corpus)
        corpus.downcase!
        corpus.gsub!(/[^\sa-z;.!?'‘’]+|\.\.\./, ' ').gsub!(/\s{2,}/, ' ')
    end

    def loop_through(words)
        order = 1
        end_idx = words.length - order
        punctuation_regex = /\.|\?|;|!/
        skip_words = ["vhd", "vhd's", "xlthlx", "burke", "qfwfq"]

        for i in 0...end_idx do
            next if punctuation_regex.match(words[i])   # don't create entry if we're at the end of a sentence

            gram, next_word = get_entry(words[i..i + order])

            save_entry(gram, next_word) if !skip_words.include?(gram) && !skip_words.include?(next_word)
        end
    end

    def get_entry(words)
        next_word = words.pop
        next_word = strip_punctuation(next_word)

        gram = words.join(' ')
        gram = strip_punctuation(gram)

        [gram, next_word]
    end

    def strip_punctuation(text)
        text.gsub(/[;.!?"‘’“”]*/, '')
    end

    def save_entry(gram, next_word)
        if !@dictionary[gram]
            @dictionary[gram] = []
        end

        @dictionary[gram].push(next_word)
    end

    def save_dictionary
        File.open('public/data/dictionary.jsonp', 'w') do |f|
            f.write("dictionary = #{@dictionary.to_json}")
        end
    end
end

######
# To Run in Terminal:
#   ruby dictionary.rb
#
######

Dictionary.new([
    'anna_fractuous-source_texts.txt',
    'annie_dillard-pilgrim_at_tinker_creek.txt',
    'annie_dillard-solar_eclipse.txt',
    'italo_calvino-distance_of_the_moon.txt',
    'poems.txt'
])