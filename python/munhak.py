import RPi.GPIO as GPIO
import requests
import json
import time
GPIO.setmode(GPIO.BCM)
GPIO.setup(4, GPIO.OUT)
GPIO.setup(5, GPIO.OUT)
GPIO.setup(6, GPIO.OUT)
GPIO.setup(11, GPIO.OUT)
url = "http://localhost:8888/munhak"
#url = "http://zenbusine.herokuapp.com/munhak"

while True : 
    response = requests.post(url)
    if response.text[1] == '1' : 
        GPIO.output(4, 1)
    else :
        GPIO.output(4, 0)
    if response.text[3] == '1' :
        GPIO.output(5, 1)
    else :
        GPIO.output(5, 0)
    if response.text[5] == '1' :
        GPIO.output(6, 1)
    else :
        GPIO.output(6, 0)
    if response.text[7] == '1':
        GPIO.output(11, 1)
    else :
        GPIO.output(11, 0)
    time.sleep(0.5)




