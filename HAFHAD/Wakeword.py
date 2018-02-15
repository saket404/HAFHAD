import snowboydecoder
import sys
import signal

interrupted = False


def signal_handler(signal, frame):
    global interrupted
    interrupted = True


def interrupt_callback():
    global interrupted
    return interrupted
def detected_callback():
    print("hotword detected")
def wake_word():
	signal.signal(signal.SIGINT, signal_handler)
	detector = snowboydecoder.HotwordDetector("Anna.pmdl", sensitivity=0.2, audio_gain=1)
	print('Listening... Press Ctrl+C to exit')

	# Main Loop
	print("\n\nWait for **Anna** word")
	detector.start(detected_callback=snowboydecoder.play_function,
		           interrupt_check=interrupt_callback,
		           sleep_time=0.03)

	detector.terminate()
    



	
        






if __name__ == "__main__":
	wake_word()
