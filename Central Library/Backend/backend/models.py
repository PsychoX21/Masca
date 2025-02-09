from django.db import models
from datetime import date
from django.core.validators import MinLengthValidator, MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser, Group
from django.contrib.auth.hashers import make_password

# Custom validator for email
def validate_iitb_email(value):
    if not value.endswith('@iitb.ac.in'):
        raise ValidationError('Email must end with @iitb.ac.in')

# Custom User Model
class User(AbstractUser):
    USER_TYPES = [
        ('student', 'Student'),
        ('admin', 'Admin'),
    ]
    
    username = models.EmailField(unique=True, validators=[validate_iitb_email], null=False, blank=False)
    password = models.CharField(max_length=128, validators=[MinLengthValidator(8, 'Password must be at least 8 characters')])
    profile_photo = models.ImageField(upload_to='profile_photo/', default='profile_photo/default-avatar.jpg')
    Name = models.CharField(max_length=100)
    DOB = models.DateField(default=date.today)
    Phone = models.BigIntegerField(validators=[MaxValueValidator(9999999999), MinValueValidator(1000000000)], default=9999999999)
    Address = models.CharField(max_length=500)
    Gender = models.CharField(max_length=20, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male')
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='student')

    recent_searches = models.JSONField(default=list, blank=True)

    groups = models.ManyToManyField('auth.Group', related_name='user_groups')
    user_permissions = models.ManyToManyField('auth.Permission', related_name='user_permissions')

    def save(self, *args, **kwargs):
        """Ensure password is hashed before saving."""

        if self.pk is None and not self.password.startswith('pbkdf2_sha256$'):
            self.password = make_password(self.password)

    # Assign superuser and staff status based on user_type
        if self.user_type == "admin":
            self.is_superuser = True
            self.is_staff = True
        else:
            self.is_superuser = False
            self.is_staff = False

        super().save(*args, **kwargs)

        # Assign default group based on user type
        group_name = "Admin" if self.user_type == "admin" else "User"
        group, _ = Group.objects.get_or_create(name=group_name)
        self.groups.add(group)

    def add_recent_search(self, book_name):
        searches = list(self.recent_searches)
        searches.insert(0, book_name)
        self.recent_searches = searches[:5]
        self.save(update_fields=['recent_searches'])

    def __str__(self):
        return self.username
