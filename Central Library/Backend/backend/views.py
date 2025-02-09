from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
import json
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.conf import settings

@csrf_exempt
def user_login(request):
    if request.method == "POST":
        data = json.loads(request.body) 
        username = data.get("username", "")
        password = data.get("password", "")

        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            csrf_token = get_token(request)
            response = JsonResponse({
                "message": "Login successful!", 
                "token": token.key,
                "csrf_token": csrf_token,
                "user": {
                    "username": user.username,
                    "user_type": user.user_type,
                    "Name": user.Name,
                    "DOB": user.DOB,
                    "Gender": user.Gender,
                    "Phone": user.Phone,
                    "Address": user.Address,
                    "profile_photo": request.build_absolute_uri(user.profile_photo.url) if user.profile_photo else None
                }
            })

            response.set_cookie(key="auth_token", value=token.key, httponly=True, secure=True, samesite="Lax", max_age=864000, path="/")

            return response
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

@csrf_exempt
def user_register(request):
    if request.method == "POST":
        username_ = request.POST.get("email")
        password_ = request.POST.get("password")
        Name_ = request.POST.get("name")
        DOB_ = request.POST.get("dob")
        gender_ = request.POST.get("gender")
        phone_ = request.POST.get("phone")
        address_ = request.POST.get("address")
        referral_ = request.POST.get("referral", "")

        # Access uploaded file (profile photo)
        profile_photo_ = request.FILES.get("profile_photo")

        # Check if user already exists
        if User.objects.filter(username=username_).exists():
            return JsonResponse({"error": "User already exists"}, status=400)
        
        if profile_photo_:
            image_data = profile_photo_
            file_name = os.path.join('profile_photo', f"{username_}_profile.jpg")
            file_path = default_storage.save(file_name, image_data)
            profile_photo_path = file_path
        else:
            profile_photo_path = 'profile_photo/profile_default.jpg'

        # Determine user type
        user_type_ = "admin" if referral_ == "MASCAA_SUPREMACY" else "student"

        user = User.objects.create_user(
            username=username_, 
            password=password_, 
            Name=Name_,
            DOB=DOB_, 
            Gender=gender_, 
            Phone=phone_,
            Address=address_, 
            profile_photo=profile_photo_path,
            user_type=user_type_
        )
        
        return JsonResponse({
            "message": f"{'Admin' if user_type_ == 'admin' else 'User'} registered successfully!"
        })

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_authenticated_user(request):
    return request.user

@csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def save_recent_search(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    try:
        data = json.loads(request.body)
        book_name = data.get('book_name')

        if not book_name:
            return JsonResponse({'error': 'book_name is required'}, status=400)

        request.user.add_recent_search(book_name)

        return JsonResponse({'success': f'Search for "{book_name}" saved', 'recent_searches': request.user.recent_searches})

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)

@csrf_exempt
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_recent_searches(request):
    return JsonResponse({'recent_searches': request.user.recent_searches})

@csrf_exempt
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_logout(request):
    try:
        if request.auth:
            request.auth.delete()
        logout(request)

        response = JsonResponse({"message": "Logout successful!"})

        if 'auth_token' in request.COOKIES:
            response.delete_cookie("auth_token")
        if 'csrftoken' in request.COOKIES:
            response.delete_cookie("csrftoken")

        return response
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
