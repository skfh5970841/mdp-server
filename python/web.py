#httplib

#import httplib
#con = httplib.HTTPConnection("주소") 
#con.request("POST","경로","매개변수","{헤더}") 
#response = con.getresponse() 
#data = response.read() 
#con.close() 

#urllib 

#import urllib
#url="주소"
#para="매개변수"
#data=urllib.urlopen(url,para).read()

#print(data)



import httplib, urllib
params = urllib.urlencode(data)
#headers = {"Content-type": "application/x-www-form-urlencoded",
#...            "Accept": "text/plain"}
conn = httplib.HTTPConnection("localhost:8888/")
conn.request("POST", "/cgi-bin/query", params)
response = conn.getresponse()
print response.status, response.reason
data = response.read()
conn.close()
