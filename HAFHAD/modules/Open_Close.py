from pythainlp.corpus import stopwords
from pythainlp.tokenize import word_tokenize
import speech_recognition as sr
from Naked.toolshed.shell import execute_js, muterun_js
from tts import tts
import sys



def open_close(text):

    print(text)
    e=word_tokenize(text,engine='newmm')
    
    
    light = []
    stopwords1 = stopwords.words('thai')
    stopwords2 = ['สิ','ดิ','หน่อย','ให้','ใน']

    filter_word1 = e
    for word in e:

        if any(['เปิด' in word, 'ปิด' in word]):
            continue
        if word == stopwords1:
            filter_word1.remove(word)

    filter_word = [word1 for word1 in filter_word1 if word1 not in stopwords2]
    print("\n")
    print(filter_word)

    if len(filter_word) < 2:
        return 0
    
    if(filter_word[0] == "เปิดไฟ"):
        light.append("open")
        light.append(filter_word[1])
        if len(filter_word) > 2:
            print(1)
            if(filter_word[2] == "และ" and filter_word[-1] != "และ"):
                print(2)
                light.append(filter_word[3])
  

    elif(filter_word[0] == "เปิด" and filter_word[1] == "ปลั๊ก"):
        light.append("open")
        light.append(filter_word[2])
        if len(filter_word) > 3:
            print(1)
            if(filter_word[3] == "และ" and filter_word[-1] != "และ"):
                print(2)
                light.append(filter_word[4])


    elif(filter_word[0] == "ปิดไฟ"):
        light.append("close")
        light.append(filter_word[1])
        if len(filter_word) > 2:
            print(1)
            if(filter_word[2] == "และ" and filter_word[-1] != "และ"):
                print(2)
                light.append(filter_word[3])
 

    elif(filter_word[0] == "ปิด" and filter_word[1] == "ปลั๊ก"):
        light.append("close")
        light.append(filter_word[2])
        if len(filter_word) > 3:
            print(1)
            if(filter_word[3] == "และ" and filter_word[-1] != "และ"):
                print(2)
                light.append(filter_word[4])
                
    else:
        return 0
                
              
                
    print(light)
    if(len(light) > 1):
    	final = ",".join(light)
    	print(final)
    	success = muterun_js('plug/plug.js',final)
    	if success.exitcode == 0:
    		print(success.stdout.decode("utf-8"))
    	else:
    		sys.stderr.write(success.stderr.decode("utf-8"))
    		
    	
    else:
        	tts("ไม่เข้าใจคำสั่งของคุณค่ะ")
    	
    print("\n\n\n")	
    return 1


