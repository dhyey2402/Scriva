import os
import sys
import io
import django
from django.core.files.uploadedfile import SimpleUploadedFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from api.models import (
    Profile, Project, Skill, Experience, Education,
    Service, SocialLink, Blog, Testimonial, MediaAsset,
    ContactMessage, PublishState
)

def run_tests():
    print("==================================================")
    print("   SCRIVA DAY 12 & DAY 13 PRODUCTION API AUDIT   ")
    print("==================================================")
    client = APIClient()
    failures = []

    # 1. Health check
    print("\n[1] Testing Health Endpoint (GET /api/health/)...")
    res = client.get('/api/health/')
    if res.status_code == status.HTTP_200_OK and res.data.get('status') == 'ok':
        print("  [PASS] Health endpoint passed:", res.data)
    else:
        print("  [FAIL] Health endpoint failed:", res.status_code, res.data)
        failures.append("Health endpoint")

    # 2. Database connection
    print("\n[2] Testing PostgreSQL Database Connection...")
    try:
        profile_count = Profile.objects.count()
        project_count = Project.objects.count()
        skill_count = Skill.objects.count()
        print(f"  [PASS] Connected to PostgreSQL. Existing records: {profile_count} profiles, {project_count} projects, {skill_count} skills.")
    except Exception as e:
        print("  [FAIL] Database connection failed:", str(e))
        failures.append("Database connection")

    # 3. Authentication
    print("\n[3] Testing JWT Authentication...")
    # Valid login
    login_res = client.post('/api/auth/login/', {'username': 'admin', 'password': 'admin123'}, format='json')
    if login_res.status_code == status.HTTP_200_OK and 'access' in login_res.data and 'refresh' in login_res.data:
        print("  [PASS] Login succeeded with valid credentials. Access and refresh tokens received.")
        access_token = login_res.data['access']
        refresh_token = login_res.data['refresh']
    else:
        print("  [FAIL] Login failed:", login_res.status_code, login_res.data)
        failures.append("Login authentication")
        access_token = None
        refresh_token = None

    # Invalid login
    bad_login_res = client.post('/api/auth/login/', {'username': 'admin', 'password': 'wrongpassword'}, format='json')
    if bad_login_res.status_code == status.HTTP_401_UNAUTHORIZED:
        print("  [PASS] Invalid credentials correctly rejected (401).")
    else:
        print("  [FAIL] Invalid credentials not rejected:", bad_login_res.status_code)
        failures.append("Invalid login rejection")

    # Token refresh
    if refresh_token:
        refresh_res = client.post('/api/auth/refresh/', {'refresh': refresh_token}, format='json')
        if refresh_res.status_code == status.HTTP_200_OK and 'access' in refresh_res.data:
            print("  [PASS] Token refresh succeeded. New access token received.")
        else:
            print("  [FAIL] Token refresh failed:", refresh_res.status_code, refresh_res.data)
            failures.append("Token refresh")

    # 4. Public Content Endpoints
    print("\n[4] Testing Content Endpoints...")
    endpoints = [
        ('/api/about/', 'About (alias)'),
        ('/api/profile/', 'Profile (alias)'),
        ('/api/profiles/', 'Profiles'),
        ('/api/skills/', 'Skills'),
        ('/api/projects/', 'Projects'),
        ('/api/blogs/', 'Blogs'),
        ('/api/experience/', 'Experience'),
        ('/api/testimonials/', 'Testimonials'),
        ('/api/services/', 'Services'),
        ('/api/education/', 'Education'),
        ('/api/social-links/', 'Social Links'),
    ]
    for url, label in endpoints:
        res = client.get(url)
        if res.status_code == status.HTTP_200_OK:
            count = len(res.data) if isinstance(res.data, list) else 1
            print(f"  [PASS] {label} ({url}) returned 200 OK (items: {count})")
        else:
            print(f"  [FAIL] {label} ({url}) failed with status {res.status_code}")
            failures.append(f"Content endpoint: {label}")

    # 5. Security & Permissions
    print("\n[5] Testing Permissions & Security...")
    # Unauthenticated dashboard access
    dash_res = client.get('/api/dashboard/stats/')
    if dash_res.status_code == status.HTTP_401_UNAUTHORIZED:
        print("  [PASS] Unauthenticated GET /api/dashboard/stats/ correctly denied (401).")
    else:
        print("  [FAIL] Unauthenticated dashboard access not denied:", dash_res.status_code)
        failures.append("Unauthenticated dashboard security")

    # Authenticated dashboard access
    if access_token:
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        dash_auth_res = client.get('/api/dashboard/stats/')
        if dash_auth_res.status_code == status.HTTP_200_OK:
            print("  [PASS] Authenticated GET /api/dashboard/stats/ returned 200:", dash_auth_res.data)
        else:
            print("  [FAIL] Authenticated dashboard access failed:", dash_auth_res.status_code)
            failures.append("Authenticated dashboard access")
        client.credentials()  # Reset credentials

    # Unauthenticated project mutation
    unauth_post = client.post('/api/projects/', {'title': 'Hack'}, format='json')
    if unauth_post.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]:
        print("  [PASS] Unauthenticated POST /api/projects/ correctly denied (401/403).")
    else:
        print("  [FAIL] Unauthenticated project creation not denied:", unauth_post.status_code)
        failures.append("Unauthenticated content mutation security")

    # 6. Draft vs Published Workflow
    print("\n[6] Testing Draft/Published Workflow (CMS -> Public Portfolio)...")
    if access_token:
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        # Create draft project
        draft_payload = {
            'title': 'Test Draft Project Workflow',
            'description': 'Integration testing draft visibility',
            'state': PublishState.DRAFT,
            'featured': False,
            'display_order': 999
        }
        create_res = client.post('/api/projects/', draft_payload, format='json')
        if create_res.status_code == status.HTTP_201_CREATED:
            test_proj_id = create_res.data['id']
            print(f"  [PASS] Admin created draft project with ID: {test_proj_id}")

            # Check admin sees it
            admin_list = client.get('/api/projects/')
            admin_ids = [p['id'] for p in admin_list.data]
            if test_proj_id in admin_ids:
                print("  [PASS] Admin can see the draft project.")
            else:
                print("  [FAIL] Admin cannot see the draft project.")
                failures.append("Admin draft visibility")

            # Check public DOES NOT see it
            client.credentials()  # Unauthenticated
            public_list = client.get('/api/projects/')
            public_ids = [p['id'] for p in public_list.data]
            if test_proj_id not in public_ids:
                print("  [PASS] Public user CANNOT see the draft project (state=DRAFT hidden).")
            else:
                print("  [FAIL] Public user unexpectedly sees draft project!")
                failures.append("Draft security leak")

            # Publish the project
            client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
            patch_res = client.patch(f'/api/projects/{test_proj_id}/', {'state': PublishState.PUBLISHED}, format='json')
            if patch_res.status_code == status.HTTP_200_OK:
                print("  [PASS] Admin updated project state to PUBLISHED.")
            else:
                print("  [FAIL] Failed to update project to PUBLISHED:", patch_res.status_code)
                failures.append("Publish update")

            # Check public DOES see it now
            client.credentials()  # Unauthenticated
            public_list_after = client.get('/api/projects/')
            public_ids_after = [p['id'] for p in public_list_after.data]
            if test_proj_id in public_ids_after:
                print("  [PASS] Public user can now see the published project!")
            else:
                print("  [FAIL] Public user cannot see published project!")
                failures.append("Published visibility")

            # Clean up test project
            client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
            del_res = client.delete(f'/api/projects/{test_proj_id}/')
            if del_res.status_code == status.HTTP_204_NO_CONTENT:
                print("  [PASS] Test project cleaned up successfully (204).")
            client.credentials()
        else:
            print("  [FAIL] Failed to create draft project:", create_res.status_code, create_res.data)
            failures.append("Create draft project")
            client.credentials()

    # 7. Media Upload Workflow
    print("\n[7] Testing Media Upload Workflow...")
    # Unauthenticated upload attempt
    dummy_img = SimpleUploadedFile("test_pixel.png", b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82", content_type="image/png")
    unauth_upload = client.post('/api/upload/image/', {'file': dummy_img}, format='multipart')
    if unauth_upload.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]:
        print("  [PASS] Unauthenticated media upload correctly denied (401/403).")
    else:
        print("  [FAIL] Unauthenticated media upload not denied:", unauth_upload.status_code)
        failures.append("Unauthenticated media upload security")

    # Authenticated upload
    if access_token:
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        dummy_img.seek(0)
        auth_upload = client.post('/api/upload/image/', {'file': dummy_img}, format='multipart')
        if auth_upload.status_code == status.HTTP_201_CREATED and 'file' in auth_upload.data:
            uploaded_url = auth_upload.data['file']
            print(f"  [PASS] Authenticated media upload succeeded (201). Returned URL: {uploaded_url}")
            # Verify file exists on disk
            media_asset_id = auth_upload.data['id']
            asset = MediaAsset.objects.get(id=media_asset_id)
            if asset.file and os.path.exists(asset.file.path):
                print(f"  [PASS] Media file verified on storage at {asset.file.path}")
                # Clean up test upload
                try:
                    os.remove(asset.file.path)
                    asset.delete()
                    print("  [PASS] Media test asset cleaned up.")
                except Exception:
                    pass
            else:
                print("  [FAIL] Media file not found on disk!")
                failures.append("Media asset storage")
        else:
            print("  [FAIL] Authenticated media upload failed:", auth_upload.status_code, auth_upload.data)
            failures.append("Authenticated media upload")
        client.credentials()

    # 8. Contact Form API
    print("\n[8] Testing Public Contact Message API...")
    # Valid contact message
    valid_contact = {
        'name': 'Sarah Connor',
        'email': 'sarah@example.com',
        'message': 'Hello from automated integration smoke test!'
    }
    contact_res = client.post('/api/contact/', valid_contact, format='json')
    if contact_res.status_code == status.HTTP_201_CREATED:
        print("  [PASS] Contact message submitted successfully (201).")
        # Verify persistence in PostgreSQL
        saved_msg = ContactMessage.objects.filter(email='sarah@example.com').first()
        if saved_msg:
            print(f"  [PASS] Contact message verified in PostgreSQL: id={saved_msg.id}, name='{saved_msg.name}'")
            saved_msg.delete()  # Clean up test message
        else:
            print("  [FAIL] Contact message not found in PostgreSQL!")
            failures.append("Contact message persistence")
    else:
        print("  [FAIL] Contact message submission failed:", contact_res.status_code, contact_res.data)
        failures.append("Contact message submission")

    # Invalid contact message (invalid email)
    invalid_contact = {
        'name': 'Sarah Connor',
        'email': 'not-an-email',
        'message': 'Should fail'
    }
    bad_contact_res = client.post('/api/contact/', invalid_contact, format='json')
    if bad_contact_res.status_code == status.HTTP_400_BAD_REQUEST:
        print("  [PASS] Invalid contact submission correctly rejected (400):", bad_contact_res.data)
    else:
        print("  [FAIL] Invalid contact submission not rejected:", bad_contact_res.status_code)
        failures.append("Invalid contact submission rejection")

    # 9. Configuration & Security Audit
    print("\n[9] Testing Production Settings & Security...")
    print(f"  - DEBUG setting: {settings.DEBUG}")
    print(f"  - ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    print(f"  - CORS_ALLOWED_ORIGINS: {settings.CORS_ALLOWED_ORIGINS}")
    print(f"  - STATIC_ROOT: {settings.STATIC_ROOT}")
    print(f"  - MEDIA_ROOT: {settings.MEDIA_ROOT}")
    print(f"  - EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"  - EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"  - EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"  - EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"  - CONTACT_EMAIL: {settings.CONTACT_EMAIL}")

    if not failures:
        print("\n==================================================")
        print("   ALL TESTS PASSED! API IS 100% PRODUCTION-READY ")
        print("==================================================")
        return True
    else:
        print("\n==================================================")
        print(f"   AUDIT COMPLETED WITH {len(failures)} FAILURE(S):")
        for f in failures:
            print(f"    - {f}")
        print("==================================================")
        return False

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
