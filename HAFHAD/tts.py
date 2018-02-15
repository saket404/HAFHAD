from gtts import gTTS
import os


def tts(text_say):

	tts = gTTS(text_say, lang = 'th',slow = False)
	tts.save("speak.mp3")
	os.system("mpg321 speak.mp3")
	
    
    
	
    


