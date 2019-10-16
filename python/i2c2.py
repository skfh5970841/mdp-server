from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
import RPi.GPIO as GPIO
import requests
import json

GPIO.setmode(GPIO.BCM)
GPIO.setup(21, GPIO.OUT)

url = "http://localhost:8888/process/nfc"

while 1 : 
    pn532 = Pn532_i2c()
    pn532.SAMconfigure()
    card_data = {'NFCNumber' : pn532.read_mifare().get_data()}
    print(card_data)
    headers = {"Content-type":"application/x-www-form-urlencoded"}
    response = requests.post(url, card_data)

    print(response.text)

    if response.text == 'OK' : 
        GPIO.output(21, 1)
    else : 
        GPIO.output(21, 0)


