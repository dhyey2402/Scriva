from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthCheckView, DashboardStatsView, ProfileViewSet, ProjectViewSet, SkillViewSet,
    ExperienceViewSet, EducationViewSet, ServiceViewSet,
    SocialLinkViewSet, BlogViewSet, TestimonialViewSet, MediaUploadView
)

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profile')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'education', EducationViewSet, basename='education')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'social-links', SocialLinkViewSet, basename='social-link')
router.register(r'blogs', BlogViewSet, basename='blog')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('upload/image/', MediaUploadView.as_view(), name='media-upload'),
    path('', include(router.urls)),
]
