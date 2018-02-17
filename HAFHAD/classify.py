#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Feb 17 05:16:43 2018

@author: saket11
"""
import json
from pythainlp.tokenize import word_tokenize as tokenize


def calculate_class_score(sentence, class_name):
    with open('corpus/words.txt') as f:
        corpus_words = json.load(f)
    
    with open('corpus/class.txt') as f:
        class_words = json.load(f)
    score = 0
    for word in sentence:
        if word in class_words[class_name]:
        # For each word in the class += 1 and divided by frequency in the vocab
            score += (1 / corpus_words[word])
 
    return score
 
def classify(sentence):
    with open('corpus/class.txt') as f:
        class_words = json.load(f)
    high_class = None
    high_score = 0
    for c in class_words.keys():
        score = calculate_class_score(sentence, c)
        if score > high_score:
            high_class = c
            high_score = score
            
    
 
    return high_class, high_score


if __name__ == "__main__":
	print(classify(tokenize("เปิดเพลง ปฏิทิน",engine='newmm')))