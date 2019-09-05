import httplib, urllib


headers = {"Content-type":"application/x-www-form-urlencoded"}
params = urllib.urlencode({'id':'아이디','password':'패스워드'})

conn=httplib.HTTPConnection("http://localhost:80")
conn.request("POST","/test/test.php",params,headers)

response = conn.getresponse()


data = response.read()
print data
conn.close()