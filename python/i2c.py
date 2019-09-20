from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
import httplib, urllib
import json
import requests

pn532 = Pn532_i2c()
pn532.SAMconfigure()
 
card_data = pn532.read_mifare().get_data()
headers = {"Content-type":"application/x-www-form-urlencoded"}
params = urllib.urlencode(card_data)
#headers = {"Content-type": "application/x-www-form-urlencoded",
#...            "Accept": "text/plain"}
conn = httplib.HTTPConnection("localhost:8888/")
conn.request("POST", "/process/nfc", params, headers)

print(card_data)
conn.close() 
