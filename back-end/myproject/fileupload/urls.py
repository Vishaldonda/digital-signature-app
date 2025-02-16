from django.urls import path
from .views import upload_file,sign_pdf_from_uploaded_file

urlpatterns = [
    path('upload/', upload_file, name='upload_file'),
    path('sign/', sign_pdf_from_uploaded_file, name='sign_pdf'),  # New URL for signing
]
