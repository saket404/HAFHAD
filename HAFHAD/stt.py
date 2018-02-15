import speech_recognition as sr
from tts import tts


def stt():
    
    # obtain audio from the microphone
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("\n\nSay Command in thai!")
        r.adjust_for_ambient_noise(source)
        audio = r.listen(source)

    # recognize speech using Google Speech Recognition
    try:
         print("Google Speech Recognition thinks you said " + r.recognize_google(audio, language ="th-TH") + "\n")
         text = r.recognize_google(audio, language ="th-TH")
        
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio\n")
        text = "ไม่เข้าใจที่พูดออกมาค่ะ"
        tts(text)
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}\n".format(e))
        text = "Could not request results from Google Speech Recognition service"
        
        
    return(text)

	
    


