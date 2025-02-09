from django.contrib import admin

# Register your models here.
from .models import User

@admin.register(User)
class BookAdmin(admin.ModelAdmin):
    list_display = ('username', 'password','Name','profile_photo','DOB','Phone','Gender','Address','user_type')
    search_fields = ('Roll_no','Name')

    fields = ('username', 'Name', 'DOB', 'Gender', 'Phone', 'Address', 'profile_photo', 'user_type')

