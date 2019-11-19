# import RPi.GPIO as GPIO
import requests
import json
import time
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(4, GPIO.OUT)
# GPIO.setup(5, GPIO.OUT)
# GPIO.setup(6, GPIO.OUT)
# GPIO.setup(10, GPIO.OUT)
url = "http://localhost:8888/munhak"

while True : 
    response = requests.post(url)
    print(response.text)
    




