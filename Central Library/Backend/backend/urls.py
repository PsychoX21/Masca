from django.urls import path
from .views import user_login, user_register, user_logout, save_recent_search, get_recent_searches
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("login/", user_login, name="login"),
    path("register/", user_register, name="register"),
    path("logout/", user_logout, name="logout"),
    path("save-recent-search/", save_recent_search, name="save_recent_search"),
    path("get-recent-searches/", get_recent_searches, name="get_recent_searches"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
