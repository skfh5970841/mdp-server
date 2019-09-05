from py532lib.i2c import *
from py532lib.frame import *
from py532lib.constants import *
import httplib, urllib

pn532 = Pn532_i2c()
pn532.SAMconfigure()
 
card_data = pn532.read_mifare().get_data()

params = urllib.urlencode(card_data)
#headers = {"Content-type": "application/x-www-form-urlencoded",
#...            "Accept": "text/plain"}
conn = httplib.HTTPConnection("localhost:8888/")
conn.request("POST", "/cgi-bin/query", params)

print(card_data)
conn.close() 
