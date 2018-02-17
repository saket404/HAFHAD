from modules.Open_Close import open_close
from modules.checkemail import checkemail
from modules.checkcalendar import checkcalendar
from stt import stt
from tts import tts
from modules.song import song
from classify import classify
from pythainlp.tokenize import word_tokenize as tokenize

def conversation():
    
    tts("ว่าไงคะ")
    text = ""
    count = 0
    flag = 0
    
    
    
    
    try:
        text = stt()
    except Exception as e:
        tts("อินเทอร์เน็ตมีปัญหาค่ะ")
        count = 2
    
    if any(['ปิดไฟ' in text, 'ปิดปลั๊ก' in text, 'เปิดไฟ' in text, 'เปิดปลั๊ก' in text]):
        count = open_close(text)
        if count == 0:
            flag = 1
        
        
    if count == 0 and flag == 0:
        token = tokenize(text,engine = 'newmm')
        result = classify(token)
        print(result)
    
        if str(result[0]) == "playsong":
            count = song(token)
            count = 1        

        if str(result[0]) == "email":
            checkemail()
            count = 1
		
        if str(result[0]) == "checkcalendar":
            count = checkcalendar(token,text)
        
        

    
		
	
    if (count == 0 and text != "ไม่เข้าใจค่ะกรุณาลองอีกครั้ง" and text != "ไม่เข้าใจที่พูดออกมาค่ะ"):
        tts("ไม่เข้าใจคำสั่งของคุณค่ะ")


	
    


