from django.db import models

class PublishState(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    PUBLISHED = 'PUBLISHED', 'Published'

class Profile(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=150)
    bio = models.TextField()
    image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    contact_email = models.EmailField()
    
    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', null=True, blank=True)
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    state = models.CharField(max_length=20, choices=PublishState.choices, default=PublishState.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title

class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    proficiency = models.IntegerField(help_text="Proficiency from 1 to 100", default=50)
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.name

class Experience(models.Model):
    company = models.CharField(max_length=150)
    position = models.CharField(max_length=150)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.position} at {self.company}"

class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    year = models.IntegerField()

    class Meta:
        ordering = ['-year']

    def __str__(self):
        return f"{self.degree} at {self.institution}"

class Service(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    icon = models.ImageField(upload_to='services/', null=True, blank=True)

    def __str__(self):
        return self.title

class SocialLink(models.Model):
    platform = models.CharField(max_length=100)
    url = models.URLField()
    display_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['display_order']

    def __str__(self):
        return self.platform

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='blogs/', null=True, blank=True)
    state = models.CharField(max_length=20, choices=PublishState.choices, default=PublishState.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Testimonial(models.Model):
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    company = models.CharField(max_length=150, blank=True)
    content = models.TextField()
    state = models.CharField(max_length=20, choices=PublishState.choices, default=PublishState.DRAFT)

    def __str__(self):
        return f"Testimonial from {self.name}"

class MediaAsset(models.Model):
    """
    Generic media upload model for files that aren't strictly attached to one model natively,
    or for rich text editors.
    """
    file = models.FileField(upload_to='uploads/')
    file_name = models.CharField(max_length=255, blank=True)
    file_type = models.CharField(max_length=50, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name or str(self.file.name)

class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} ({self.email})"
