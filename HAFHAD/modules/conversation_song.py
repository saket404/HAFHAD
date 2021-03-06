#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Feb 19 07:15:29 2018

@author: saket11
"""

from modules.Open_Close import open_close
from modules.checkemail import checkemail
from modules.checkcalendar import checkcalendar
from modules.reminder import addEvent
from stt import stt
from tts import tts
from classify import classify
from pythainlp.tokenize import word_tokenize as tokenize

def conversation_song(flag,text):
    
    
    count = 0
    
    """
    flag = 2 when the command is issued through music mode
    flag = 1 when the command is to switch on/off plug.
    flag = 0 when other commands are intiated.
    """

    
    if any(['ปิดไฟ' in text, 'ปิดปลั๊ก' in text, 'เปิดไฟ' in text, 'เปิดปลั๊ก' in text]):
        count = open_close(text)
        if count == 0:
            flag = 1
                
    if count == 0 and flag != 0:
        token = tokenize(text,engine = 'newmm')
        result = classify(token)
        print(result)
    

        if str(result[0]) == "email" and float(result[1]) > 0.5:
            checkemail()
            count = 1
		
        if str(result[0]) == "checkcalendar" and float(result[1]) > 0.5:
            count = checkcalendar(token,text)
            
        if str(result[0]) == "setreminder" and float(result[1]) > 0.5:
            addEvent()
            count = 1
        
        

    
		
	
    if (count == 0 and text != "ไม่เข้าใจค่ะกรุณาลองอีกครั้ง" and text != "ไม่เข้าใจที่พูดออกมาค่ะ"):
        tts("ไม่เข้าใจคำสั่งของคุณค่ะ")

