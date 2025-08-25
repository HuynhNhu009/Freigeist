from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from cloudinary.models import CloudinaryField
from rest_framework import serializers
import datetime


# --------- USER ----------
#class User(models.Model):
class User(AbstractBaseUser, PermissionsMixin):
    user_fullname = models.CharField(max_length=100)
    user_email = models.EmailField(max_length=100, unique=True)
    user_dob = models.DateField()
    user_gender = models.CharField(max_length=10)
    user_createAt = models.DateTimeField(auto_now_add=True)
    # user_password = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    user_avatarUrl = models.CharField(max_length=300, blank=True, null=True)
    user_interests = models.TextField(blank=True, null=True)
    user_isBlocked = models.BooleanField(default=False)


    USERNAME_FIELD = 'user_email' 

    def __str__(self):
        return self.user_fullname




# --------- DIARY ENTRY ----------
class DiaryEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diary_entries')
    de_date = models.DateField()
    de_title = models.CharField(max_length=255)
    de_content = models.TextField()
    de_emoState = models.CharField(max_length=50, null=True, blank=True)
    de_emoScore = models.IntegerField(blank=True, null=True)
    de_advice = models.TextField(blank=True, null=True)
    de_isDelete = models.BooleanField(default=False)
    de_editCount = models.IntegerField(default=0)

    tags = models.ManyToManyField('Tag', through='DiaryTag', related_name='entries')

    def __str__(self):
        return self.de_title


# --------- TAG ----------
class Tag(models.Model):
    tag_name = models.CharField(max_length=100)
    tag_desc = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.tag_name


# --------- MIDDLE TABLE: DiaryTag ----------
class DiaryTag(models.Model):
    diary_entry = models.ForeignKey(DiaryEntry, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)


# --------- DIARY IMAGE ----------
class DiaryImage(models.Model):
    diary_entry = models.ForeignKey(DiaryEntry, on_delete=models.CASCADE, related_name='images')
    di_imageUrl = CloudinaryField('image')  
    

# --------- REMINDER ----------
class Reminder(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High')
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed')
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')
    rm_title = models.CharField(max_length=50)
    rm_content = models.TextField(blank=False, null=False)
    rm_date = models.DateField(blank=False, null=False)
    rm_time = models.TimeField(blank=False, null=False, default=datetime.time(8, 0))
    rm_priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    rm_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.rm_title} ({self.rm_date} {self.rm_time})"


# --------- FEEDBACK TYPE ----------
class FeedbackType(models.Model):
    ft_name = models.CharField(max_length=100)
    ft_desc = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.ft_name


# --------- FEEDBACK ----------
class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    feedback_type = models.ForeignKey(FeedbackType, on_delete=models.CASCADE)
    fe_title = models.CharField(max_length=255, default="Untitled")
    fe_content = models.TextField()
    fe_submitedAt = models.DateTimeField(auto_now_add=True)
    fe_isResolve = models.BooleanField(default=False)

    def __str__(self):
        return f"Feedback {self.id} from {self.user}"


# --------- RESPONSE ----------
class Response(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='responses')
    re_content = models.TextField()
    re_createAt = models.DateTimeField(auto_now_add=True)
    re_isSent = models.BooleanField(default=False)

    def __str__(self):
        return f"Response {self.id} to Feedback {self.feedback.id}"
