# require 'pry-byebug'
require 'json'

class Library
    def initialize(corpus_path)
        @corpus_path = corpus_path

        load_corpus
        create_library
        save_library
    end

    def load_corpus
        File.open(@corpus_path) do |f| 
            @corpus = f.read
        end
    end

    def create_library
        words = format_text
        grams = {}
        order = 2

        punctuation_regex = /\.|\?|;|!/
        end_idx = words.length - order
        for i in 0...end_idx do
            next if punctuation_regex.match(words[i])
            
            gram = words[i...i + order].join(' ')
            gram = strip_punctuation(gram)

            next_word = words[i + order]
            next_word = strip_punctuation(next_word)
            
            if !grams[gram]
                grams[gram] = []
            end

            grams[gram].push(next_word)
        end

        @library = grams
    end

    def save_library
        File.open('public/data/library.jsonp', 'w') do |f|
            f.write("library = #{@library.to_json}")
        end
    end

    def format_text
        @corpus = @corpus.gsub(/[^\sA-Za-z;.!?'"‘’“”]+/, '')
        @corpus = @corpus.gsub(/\s{2,}/, ' ')
        
        @corpus.split(' ')
    end

    def strip_punctuation(text)
        text.gsub(/[;.!?"‘’“”]*/, '')
    end
end

######
# To Run in Terminal:
#   ruby dictionary.rb
#
######

Library.new('data/annie_dillard-solar_eclipse.txt')