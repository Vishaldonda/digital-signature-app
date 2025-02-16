import os
import subprocess
import time
import shutil
from django.conf import settings
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from pyhanko.sign import signers
from pyhanko.sign.fields import append_signature_field, SigFieldSpec
from pyhanko.pdf_utils.incremental_writer import IncrementalPdfFileWriter
from pyhanko.sign.general import SigningError
from pyhanko.sign.signers import SimpleSigner, sign_pdf

from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Set up paths dynamically
MEDIA_DIR = settings.MEDIA_ROOT
# INPUT_PDF = os.path.join(MEDIA_DIR, 'input', 'input.pdf')
FIXED_PDF = os.path.join(MEDIA_DIR, 'output', 'fixed_output.pdf')
SIGNED_PDF = os.path.join(MEDIA_DIR, 'output', 'signed_output.pdf')

KEY_PASSWORD = "vishal@123"
PFX_FILE = os.path.join(MEDIA_DIR, 'output', 'my_certificate.pfx')
KEY_FILE = os.path.join(MEDIA_DIR, 'output', 'private_key.pem')
CERT_FILE = os.path.join(MEDIA_DIR, 'output', 'certificate.pem')

def get_latest_uploaded_file():
    # get latest uploaded file
    upload_dir = MEDIA_DIR
    pdf_files = [f for f in os.listdir(upload_dir) if f.endswith('.pdf')]
    
    if not pdf_files:
        return None  # No uploaded files found

    latest_file = max(pdf_files, key=lambda f: os.path.getctime(os.path.join(upload_dir, f)))
    return os.path.join(upload_dir, latest_file)

def run_command(command):
    # run command in sub process
    try:
        subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e.stderr}")

def generate_key_and_cert():
    # generate key and certificate
    print("🔹 Generating RSA private key and self-signed certificate...")
    run_command(f'openssl genrsa -out "{KEY_FILE}" 2048')
    run_command(f'openssl req -new -x509 -key "{KEY_FILE}" -out "{CERT_FILE}" -days 365 -subj "/CN=My Digital Signature"')
    print("RSA key and certificate created successfully.")

def create_pfx():
    #create a .pfx file
    print("🔹 Creating PFX file...")
    run_command(f'openssl pkcs12 -export -out "{PFX_FILE}" -inkey "{KEY_FILE}" -in "{CERT_FILE}" -password pass:{KEY_PASSWORD}')
    print("PFX file created successfully.")

def fix_pdf(INPUT_PDF):
    # clean pdf and syntax using ghost script
    print("🔹 Fixing PDF syntax using Ghostscript...")
    gs_command = [
        "gswin64c", "-dNOPAUSE", "-dBATCH", "-dSAFER",
        "-sDEVICE=pdfwrite", "-dPDFSETTINGS=/prepress",
        f"-sOutputFile={FIXED_PDF}", INPUT_PDF
    ]
    print("Running command:", " ".join(gs_command))

    try:
        result = subprocess.run(gs_command, shell=True, check=True, capture_output=True, text=True)
        print("Ghostscript Output:", result.stdout)
        print("Ghostscript Error (if any):", result.stderr)
        print("PDF syntax fixed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Ghostscript Error:\n{e.stderr}")

    time.sleep(3)  # Wait to ensure the file is processed
    if os.path.exists(FIXED_PDF) and os.path.getsize(FIXED_PDF) > 0:
        print("Fixed PDF was created successfully!")
        backup_pdf = os.path.join(MEDIA_DIR, "output", "backup_fixed_output.pdf")
        shutil.copy(FIXED_PDF, backup_pdf)
        print("Backup created to ensure integrity.")
    else:
        print("Fixed PDF is missing!")

def add_signature_field():
    # add signature to the fixed .pdf
    print("🔹 Adding signature field...")
    output_pdf = os.path.join(MEDIA_DIR, "output", "fixed_with_sig.pdf")

    try:
        with open(FIXED_PDF, "rb") as pdf_in, open(output_pdf, "wb") as pdf_out:
            pdf_writer = IncrementalPdfFileWriter(pdf_in)
            sig_spec = SigFieldSpec(sig_field_name="MySignature")
            append_signature_field(pdf_writer, sig_field_spec=sig_spec)
            pdf_writer.write(pdf_out)
        print(f"Signature field added successfully in: {output_pdf}")
        return output_pdf
    except Exception as e:
        print(f"Error adding signature field: {e}")
        return None

def apply_digital_signature(fixed_with_sig_pdf):
    # sign the pdf using pyhanco
    print("🔹 Applying digital signature...")
    try:
        signer = SimpleSigner.load_pkcs12(PFX_FILE, passphrase=KEY_PASSWORD.encode())
        with open(fixed_with_sig_pdf, "rb") as pdf_in, open(SIGNED_PDF, "wb") as pdf_out:
            pdf_writer = IncrementalPdfFileWriter(pdf_in)
            signature_meta = signers.PdfSignatureMetadata(field_name="MySignature")
            pdf_signer = signers.PdfSigner(signature_meta, signer=signer)
            pdf_signer.sign_pdf(pdf_writer, output=pdf_out)
        print(f"Digital signature applied: {SIGNED_PDF}")
    except SigningError as e:
        print(f"Signing Error: {e}")
    except Exception as e:
        print(f"Unexpected Error: {e}")

@api_view(['GET'])
def sign_pdf_from_uploaded_file(request):
    # handle the signing process
    try:
        
        latest_pdf = get_latest_uploaded_file()
        if not latest_pdf:
            return Response({"error": "No PDF file found in uploads."}, status=400)
        
        print(f"🔹 Using uploaded file: {latest_pdf}")

        generate_key_and_cert()
        create_pfx()
        fix_pdf(latest_pdf)
        fixed_with_sig_pdf = add_signature_field()

        if fixed_with_sig_pdf:
            apply_digital_signature(fixed_with_sig_pdf)
            signed_pdf_url = f"/media/output/signed_output.pdf"
            return Response({"message": "File signed successfully", "signed_pdf_url": signed_pdf_url}, status=200)
        else:
            return Response({"error": "Error in adding signature field"}, status=500)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def upload_file(request):
    if request.method == 'POST' and request.FILES['file']:
        uploaded_file = request.FILES['file']
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        file_url = fs.url(filename)
        return Response({'message': 'File uploaded successfully', 'file_url': file_url}, status=200)
    return Response({'error': 'No file uploaded'}, status=400)


