import nltk

# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')

import re, string, unicodedata, os
import nltk
import inflect
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from pyresparser import ResumeParser
from nltk.stem import LancasterStemmer, WordNetLemmatizer


from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer,TfidfVectorizer

from nltk.tokenize import word_tokenize

from sklearn.metrics.pairwise import cosine_similarity
import pickle



import PyPDF2
import spacy

kyw=pickle.load(open("keywords.pkl","rb"))

def count_similarity(text1,text2):
  t1=normalise_sent(text1)
  t2=normalise_sent(text2)
  v=CountVectorizer()
  t_out=v.fit_transform([t1[0],t2[0]])
  return(cosine_similarity(t_out.toarray())[0][1])

def remove_non_ascii(words):
    new_words = []
    for word in words:
        new_word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('utf-8', 'ignore')
        new_words.append(new_word)
    return new_words

def remove_stopwords(words):
    new_words = []
    for word in words:
        # print(word)
        if word not in stopwords.words('english'):
            new_words.append(word)
    return new_words


def remove_punctuation(words):
    new_words = []
    for word in words:
        new_word = re.sub(r'[^\w\s]', '', word)
        if new_word != '':
            new_words.append(new_word)
    return new_words

def replace_numbers(words):
    p = inflect.engine()
    new_words = []
    for word in words:
        if word.isdigit():
            new_word = p.number_to_words(word)
            new_words.append(new_word)
        else:
            new_words.append(word)
    return new_words

def to_lowercase(words):
    new_words = []
    for word in words:
        new_word = word.lower()
        new_words.append(new_word)
    return new_words

def lemmatize_verbs(words):
    lemmatizer = WordNetLemmatizer()
    lemmas = []
    for word in words:
        lemma = lemmatizer.lemmatize(word, pos='v')
        lemmas.append(lemma)
    return lemmas

def get_keywords(words):
    new_words = list()
    for word in words:
        if word in kyw:
            new_words.append(word)

    return new_words

def normalise_sent(x):
  x=word_tokenize(x)
  x=remove_non_ascii(x)
  x=remove_punctuation(x)
  x=replace_numbers(x)
  x=to_lowercase(x)
  x=lemmatize_verbs(x)
  x=remove_stopwords(x)
  x=get_keywords(x)
  x = [' '.join(x)]
  return x

def getrank(jd,resume):
    pdfReader = PyPDF2.PdfReader(resume)
    pageObj = pdfReader.pages[0]
    resumetext = pageObj.extract_text()
    try:
        return count_similarity(jd,resumetext)
    except:
        return 0


def parseresume(resume):
    pdfReader = PyPDF2.PdfReader(resume)
    pageObj = pdfReader.pages[0]
    resume = pageObj.extract_text()
    nlp_model = spacy.load("nlp_model")
    doc = nlp_model(resume)
    d=dict()
    for ent in doc.ents:
        d[ent.label_.upper()]=ent.text
    print(d)
    if 'SKILLS' not in d:
        return ""
    return d['SKILLS']























































def parseresumev2(resume):
    save_filename="resume.pdf"
    resume.save(os.path.join('parser_save', save_filename))
    data = ResumeParser(os.path.join("parser_save","resume.pdf")).get_extracted_data()
    if 'skills' not in data:
        return ""
    return ", ".join(data['skills'])
