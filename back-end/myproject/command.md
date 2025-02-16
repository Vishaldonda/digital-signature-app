step1 : create sign field
1. `pyhanko sign addfields --field 1/100,100,200,150/MySignature input.pdf output.pdf`

step2 : Generate a Private Key and Certificate


Generate a private key (key.pem):
- `openssl genpkey -algorithm RSA -out key.pem`

Ge`nerate a self-signed certificate (cert.pem):
- `openssl req -new -x509 -key key.pem -out cert.pem -days 365`

***step3: Convert .pem to .pfx (optional)
`openssl pkcs12 -export -out my_certificate.pfx -inkey key.pem -in cert.pem`
- It will ask for a password—remember this, as you’ll need it when signing. : vishal@123

***Step 4: Add a Signature Field to the PDF
`pyhanko sign addfields --field 1/100,100,200,150/MySignature input.pdf output.pdf`

***Step 5: Sign the PDF
1. Now, sign the PDF using your .pem certificate:
`pyhanko sign addsig --field MySignature pemder --key key.pem --cert cert.pem output.pdf signed_output.pdf`

2. OR if using .pfx:
`pyhanko sign addsig --field MySignature pkcs12 output.pdf signed_output.pdf my_certificate.pfx`

`pyhanko sign addsig --field MySignature pkcs12 --passfile password.txt output.pdf signed_output.pdf my_certificate.pfx`

`pyhanko sign addsig --field MySignature pkcs12 --no-pass output.pdf signed_output.pdf my_certificate.pfx`


-  Convert .pfx to .pem (Extract Key & Cert)
    - If PyHanko struggles with .pfx, convert it to .pem files
- Extract the Private Key:
    - openssl pkcs12 -in my_certificate.pfx -nocerts -nodes -out private_key.pem
- Extract the Certificate:
    - openssl pkcs12 -in my_certificate.pfx -clcerts -nokeys -out certificate.pem
- If your private key is password-protected, you'll need to enter it when prompted.


clean- 
`gswin64c -o fixed_output.pdf -sDEVICE=pdfwrite -dPDFSETTINGS=/prepress output.pdf`

signed-output-
`pyhanko sign addsig --field MySignature pemder --key private_key.pem --cert certificate.pem --no-pass fixed_output.pdf signed_output.pdf`

Verify the Signature
    - `pyhanko sign validate signed_output.pdf`
