import requests
 
r = requests.post('http://localhost:8888/process/nfc', data = {'key':'value'})
 


print(r.text)
print(r.status_code)