from modules.Open_Close import open_close
from modules.checkemail import checkemail
from modules.checkcalendar import checkcalendar
from stt import stt
from tts import tts
from modules.song import song

def conversation():
    
    tts("ว่าไงคะ")
    text = ""
    count = 0
    try:
        text = stt()
    except Exception as e:
        tts("อินเทอร์เน็ตมีปัญหาค่ะ")
        count = 2
    
    
    
    
    if any(['ปิดไฟ' in text, 'ปิดปลั๊ก' in text, 'เปิดไฟ' in text, 'เปิดปลั๊ก' in text]):
        count = open_close(text)

    if any(['เปิดเพลง' in text, 'เล่นเพลง' in text]):
        count = song(text)
        count = 1        

    if any(['เช็คเมล์' in text,'เช็คอีเมล' in text,'เช็ค inbox' in text,'ตรวจอีเมล' in text, 'ตรวจเมล์' in text]):
        checkemail()
        count = 1
		
    if any(['บอกการแจ้งเตือนปฏิทิน' in text,'ดูปฏิทิน' in text, 'แจ้งเตือนอะไร' in text,'เช็คปฏิทิน' in text, 'เช็คแจ้งเตือน' in text,"ดูการแจ้งเตือน" in text,"มีการแจ้งเตือน" in text]):
        count = checkcalendar(text)
        
        

    
		
	
    if (count == 0 and text != "ไม่เข้าใจค่ะกรุณาลองอีกครั้ง" and text != "ไม่เข้าใจที่พูดออกมาค่ะ"):
        tts("ไม่เข้าใจคำสั่งของคุณค่ะ")


	
    


