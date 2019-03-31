var random =require('../py_random')
function String(){
    this.random=function(length_range, kwargs={}){
        length = length_range
        if (Array.isArray(length_range))
            length = random.randint(length_range[0], length_range[1])
        charset = kwargs.charset||"abcdefghijklmnopqrstuvwxyz";
        if (Array.isArray(charset)) return random.choice(charset)
        else{
            var word="";
            for(var i=0;i<length;i++) word+=random.choice(charset);
            return word
        }
    }
    this.random_sentence=function(word_count_range, kwargs={}){
        word_count = word_count_range
        if (Array.isArray(word_count_range))
            word_count = random.randint(word_count_range[0], word_count_range[1])
        word_length_range = kwargs.word_length_range||[3, 8]
        first_letter_uppercase = kwargs.first_letter_uppercase||true
        charset = kwargs.charset||"abcdefghijklmnopqrstuvwxyz"
        word_separators = kwargs.word_separators||" "
        if (word_separators ==null || word_separators.length == 0)
            word_separators = [" "]
        sentence_terminators = kwargs.sentence_terminators||['.','!']
        if (sentence_terminators==null || sentence_terminators.length == 0)
            sentence_terminators = [""]
        words = []
        for (var i=0;i<word_count;i++)
            words.push(this.random(word_length_range, charset=charset))
        if (first_letter_uppercase)
            words[0][0] = words[0][0].toUpperCase()
        var sentence=""
        for(var i=0;i<words.length-1;i++) sentence+=words[i]+random.choice(word_separators)
        sentence+=words[words.length-1]+random.choice(sentence_terminators)
        return sentence
    }
    this.random_paragraph=function(sentence_count_range, kwargs={}){
        sentence_count = sentence_count_range
        if (Array.isArray(sentence_count_range))
            sentence_count = random.randint(sentence_count_range[0], sentence_count_range[1])
        word_count_range = kwargs.word_count_range||[6, 10]
        first_letter_uppercase = kwargs.first_letter_uppercase||true
        kwargs["first_letter_uppercase"] = false
        termination_percentage = kwargs.termination_percentage||0.3
        if (0 > termination_percentage||termination_percentage > 1)
            throw new Error("Invalid termination_percentage")
        sentence_joiners = kwargs.sentence_joiners||""
        if (sentence_joiners == null || sentence_joiners.length == 0)
            sentence_joiners = [""]
        sentence_separators = kwargs.sentence_separators||[' ']
        if (sentence_separators==null || sentence_separators.length == 0)
            sentence_separators = [""]
        sentence_terminators = kwargs.sentence_terminators||['!','.']
        if (sentence_terminators==null || sentence_terminators.length == 0)
            sentence_terminators = [""]
        sentences = []
        capitalize_next_sentence = true
        for (var i=0;i<sentence_count;i++){
            string = this.random_sentence(word_count_range, kwargs)
            sentences.push(string)
        }
        var paragraph="";
        for(var i=0;i<sentences.length-1;i++)
            paragraph+=sentences[i]+random.choice(sentence_joiners);
        paragraph+=sentences[sentences.length-1]
        return paragraph
    }
}
module.exports = String;