var
    exists = fs.exists || path.exists,
    tmpDir = os.tmpDir || _getTMPDir,
    tmpDir = os.tmpdir || os.tmpDir || _getTMPDir,
    _TMP = tmpDir(),
    randomChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",
    randomCharsLength = randomChars.length;