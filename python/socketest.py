import socket

def run(host='127.0.0.1', port=4000):
  with socket.socket() as s:
    s.connect((host, port))
    line = input('>')
    s.sendall(line.encode())
    res = s.recv(1024)
    print(f'={resp.decode()}')

if __name__ == '__main__':
  run()