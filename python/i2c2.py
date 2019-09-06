from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
import requests
url = "http://localhost:8888/process/nfc"
pn532 = Pn532_i2c()
pn532.SAMconfigure()
card_data = {'NFCnumber' : pn532.read_mifare().get_data()}
print(card_data)
headers = {"Content-type":"application/x-www-form-urlencoded"}
r = requests.post(url, data=json.dumps(card_data))

print(r.text)