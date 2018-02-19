#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Feb 17 05:09:07 2018

@author: saket11
"""

from pythainlp.tokenize import word_tokenize
import json
 

"""
Training Data

Edit here to add intents
===========================================================================


"""
 
intents = [{
    "name": "playsong",
    "patterns": [
        'เปิดเพลง','เล่นเพลง'
    ]
}, {
    "name": "checkcalendar",
    "patterns": [
        'บอกการแจ้งเตือนปฏิทิน','ดูปฏิทิน', 'มีการแจ้งเตือน','เช็คปฏิทิน','เช็คการแจ้งเตือน',"ดูการแจ้งเตือน",'เช็คแจ้งเตือน'
    ]
},{
    "name": "setreminder",
    "patterns": [
        'ตั้งการแจ้งเตือนใหม่'
    ]
},{
    "name": "email",
    "patterns": [
        'เช็คเมล์','เช็คอีเมล','เช็คinbox','ตรวจอีเมล','ตรวจเมล์'
    ]
}]

"""

===========================================================================


"""    
    
    
"""Get classes of intent from data""" 
classes = list(map(lambda intent: intent['name'], intents))
 



"""Create frequency table with each class and its corresponding words"""
class_words = {}
corpus_words = {}
for intent in intents:
  class_words[intent['name']] = []
  for pattern in intent['patterns']:
    for word in word_tokenize(pattern,engine='newmm'):
      if word not in corpus_words:
        corpus_words[word] = 1
      else:
        corpus_words[word] += 1
      class_words[intent['name']].extend([word])
     
print("Word in each class:")
print(class_words)   
print("\n")
print("All words with frequency")
print(corpus_words)
 
 
with open('corpus/class.txt', 'w') as f:
    json.dump(class_words, f)
with open('corpus/words.txt', 'w') as f:
    json.dump(corpus_words, f)
       
 
    
    

   

