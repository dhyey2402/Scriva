from rest_framework import viewsets, status, parsers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.core.exceptions import ValidationError
from .models import (
    Profile, Project, Skill, Experience, Education, 
    Service, SocialLink, Blog, Testimonial, MediaAsset, PublishState,
    ContactMessage
)
from .serializers import (
    ProfileSerializer, ProjectSerializer, SkillSerializer, ExperienceSerializer, 
    EducationSerializer, ServiceSerializer, SocialLinkSerializer, BlogSerializer, 
    TestimonialSerializer, MediaAssetSerializer, ContactMessageSerializer
)
from .permissions import IsAdminOrReadOnly
import os

class HealthCheckView(APIView):
    """
    Simple health check endpoint to verify the API is running.
    """
    def get(self, request, *args, **kwargs):
        return Response({"status": "ok", "message": "SCRIVA API is running."}, status=status.HTTP_200_OK)

class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        return Response({
            "projects": Project.objects.count(),
            "blogs": Blog.objects.count(),
            "skills": Skill.objects.count(),
            "experience": Experience.objects.count(),
            "testimonials": Testimonial.objects.count(),
            "services": Service.objects.count(),
            "education": Education.objects.count(),
        }, status=status.HTTP_200_OK)

class BasePublishViewSet(viewsets.ModelViewSet):
    """
    Base viewset for models that have a 'state' field (draft/published).
    """
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if not (self.request.user and self.request.user.is_staff):
            return queryset.filter(state=PublishState.PUBLISHED)
        return queryset

class ProjectViewSet(BasePublishViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class BlogViewSet(BasePublishViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class TestimonialViewSet(BasePublishViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

# Models without draft/published state
class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrReadOnly]

class ProfileViewSet(BaseViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class SkillViewSet(BaseViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class ExperienceViewSet(BaseViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

class EducationViewSet(BaseViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

class ServiceViewSet(BaseViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class SocialLinkViewSet(BaseViewSet):
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer

class MediaUploadView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Basic validation
        max_size = 5 * 1024 * 1024 # 5 MB
        if file_obj.size > max_size:
            return Response({"error": "File size exceeds 5MB limit."}, status=status.HTTP_400_BAD_REQUEST)

        # Allowed types check
        allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
        content_type = file_obj.content_type
        if content_type not in allowed_types:
            return Response({"error": "Unsupported file type."}, status=status.HTTP_400_BAD_REQUEST)

        media = MediaAsset(
            file=file_obj,
            file_name=file_obj.name,
            file_type=content_type
        )
        media.save()
        
        serializer = MediaAssetSerializer(media, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class ContactMessageView(APIView):
    permission_classes = [] # Public endpoint

    def post(self, request, *args, **kwargs):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            # Save the message to DB first
            message_obj = serializer.save()
            
            # Attempt to send email
            try:
                send_mail(
                    subject=f"New Portfolio Contact from {message_obj.name}",
                    message=f"Name: {message_obj.name}\nEmail: {message_obj.email}\n\nMessage:\n{message_obj.message}",
                    from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@example.com',
                    recipient_list=[settings.CONTACT_EMAIL] if hasattr(settings, 'CONTACT_EMAIL') else ['admin@example.com'],
                    fail_silently=True,
                )
            except Exception as e:
                logger.error(f"Failed to send email for contact message {message_obj.id}: {str(e)}")
                # We don't return an error to the user because the message is safely in DB
            
            return Response({"success": "Message sent successfully"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
