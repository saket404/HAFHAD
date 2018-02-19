from __future__ import unicode_literals
import youtube_dl
import vlc
import urllib
import urllib.request as urllib2
import urllib.parse
from bs4 import BeautifulSoup
from pythainlp.tokenize import word_tokenize 
from tts import tts
from stt import stt
from modules.word import wake_word
from modules.conversation_song import conversation_song

inte = False





def getLink(search): 
    query = urllib.parse.quote(search)
    url = "https://www.youtube.com/results?search_query=" + query
    response = urllib2.urlopen(url)
    html = response.read()
    soup = BeautifulSoup(html,"html5lib")
    find = soup.findAll(attrs={'class':'yt-uix-tile-link'})
    detail = find[0]
    link = 'https://www.youtube.com'+detail['href']
    return link

def my_hook(d):
    if d['status'] == 'finished':
        print('Done downloading, now converting ...')



def getSong(link):
    
    ydl_opts = {
            'format': 'worstaudio/worst',    
            'extractaudio': True,
            'outtmpl': 'song/%(title)s',        
            'noplaylist' : True,        
            'progress_hooks': [my_hook],
            'prefer_ffmpeg': True
            }

    r = None
    try:
        tts("กําลังหาเพลงค่ะ")
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([link])
            r = ydl.extract_info(link,download=False)
            
            
        return r['title']
    except Exception as e:
        tts("มีปัญหาโหลดเพลงค่ะ")
        
        return 0
            
    



def playSong(song):
    try:
        p = vlc.MediaPlayer("song/"+song)
        tts("เข้าสู่โหมดเพลงนะค่ะ")
        p.play()
    
        
        while True:
            p.audio_set_volume(100)
            wake_word()
            p.audio_set_volume(40)
            tts("ว่าไงค่ะ")
            text = "ไม่"
            
            try:
                text = stt()
            except Exception as e:
                tts("ไม่เข้าใจที่พูดออกมาค่ะ")
                continue
            
            
            
            print("You said: "+text+"\n")
            
            if("ปิดเพลง" in text):
                tts("เรียบร้อยค่ะ")
                p.stop()
                break
            elif("หยุดเพลง" in text or "Pause" in text or "พอส" in text):
                tts("หยุดเพลงนะค่ะ")
                p.pause()
                continue
            elif("ต่อ" in text or "Unpause" in text or "อันพอส" in text):
                tts("เล่นเพลงต่อนะค่ะ")
                p.play()
                continue
            else:
                flag = 2
                p.pause()
                try:
                    conversation_song(flag,text)
                except Exception as e:
                    tts("ไม่เข้าใจคำสั่งของคุณค่ะ")
                    
                p.play()
            
        
        
        return 1
    except Exception as e:
        tts("มีปัญหาเล่นเพลงค่ะ")
        return 0
        
        
        
    
    
    
def song(token):   
    e=token
    if(e[0] == 'เล่น' or e[0] == 'เปิด'):
        if(e[1] == 'เพลง' and e[1] != e[-1]):
            print(e)
            e.pop(0)
            e.pop(0)
            search = ''.join(e)
            print("Song to Search: %s"%search)
            link = getLink(search)
            
            song = getSong(link)
            if(song == 0):
                return 0
            
            player = playSong(song)
            if(player == 0):
                return 0
            else:
                return player
            
        elif(e[1] == 'เพลง' and e[1] == e[-1]):
            tts("กรุณาระบุชื่อเพลงด้วยค่ะ")
            
            try:
                search = stt()
            except Exception as e:
                tts("อินเทอร์เน็ตมีปัญหาค่ะ")
                return 0
            
            print("Song to Search: %s"%search)
            link = getLink(search)
            
            song = getSong(link)
            if(song == 0):
                return 0
            
            player = playSong(song)
            if(player == 0):
                return 0
            else:
                return player
            
            return 0
        else:
            tts("ไม่เข้าใจคำสั่งของคุณค่ะ")
            return 0
            
    else:
        return 0
            
    
    

