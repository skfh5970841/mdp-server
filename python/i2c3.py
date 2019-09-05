from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
import requests
import json

url = "http://localhost:3000"
data = {'msg': 'Hi!!!'}
headers = {"Content-type":"application/x-www-form-urlencoded"}

pn532 = Pn532_i2c()
pn532.SAMconfigure()
 
card_data = pn532.read_mifare().get_data()
print(card_data)

r = requests.post(url, data=card_data, headers=headers)