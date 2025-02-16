pyHanko
PyHanko is a tool for signing and stamping PDF files.

PKCS (Public-Key Cryptography Standards)
PKCS is a set of cryptographic standards developed by RSA Security to standardize public-key cryptography. These standards define file formats, cryptographic protocols, and encryption techniques for secure communication and authentication.

PKCS#11: Standard for hardware security modules (HSMs) and smart cards.



Steps:
Create a signature field in the PDF at specific coordinates.
Sign the PDF using a certificate (.pfx or .pem).
Return the signed PDF (output.pdf).


1. pyhanko sign addfields --field 1/100,100,200,150/MySignature input.pdf output.pdf
2. pyhanko sign addsig --field MySignature pkcs12 output.pdf signed_output.pdf my_certificate.pfx - 
     (or .p12 file) is a PKCS#12 archive that contains your private key and public certificate

- Where to get a .pfx file?
You can either:

1. Generate one yourself: If you already have an existing X.509 certificate and private key, you can use a tool like OpenSSL to create a .pfx file.

2. Obtain it from a Certificate Authority (CA): When you apply for a digital certificate (for example, from providers like DigiCert, GlobalSign, etc.), you might get a .pfx file after the certificate is issued.

1. - How to create a .pfx file from a .pem certificate and private key?

    If you already have a `.pem certificate` and a `private key` (`my_cert.pem` and `my_key.pem`), 
    - you can use OpenSSL to create the .pfx file:

    - openssl pkcs12 -export -out my_certificate.pfx -inkey my_key.pem -in my_cert.pem

2. - If You Don't Have a .pfx File
If you don’t have a .pfx file or private key:

You can create one using OpenSSL (if you have a .pem certificate and private key).
Alternatively, you can use a certificate file in .pem format directly with PyHanko by specifying the private key and certificate.
    
    - pyhanko sign addsig --field MySignature pemder --key my_key.pem --cert my_cert.pem input.pdf signed_output.pdf

```
- What is a .pem Certificate?
- A .pem (Privacy-Enhanced Mail) certificate is a base64-encoded format used to store cryptographic keys, certificates, and other security-related information. It's commonly used in SSL/TLS, digital signatures, and authentication systems

- What is a .pfx File?
A .pfx (Personal Information Exchange) file, also known as PKCS#12 (Public Key Cryptography Standard #12), is a binary format that stores:

Private Key (used for signing and decrypting)
Public Certificate (verifies identity)
Certificate Chain (intermediate and root CA certificates, if applicable)
```