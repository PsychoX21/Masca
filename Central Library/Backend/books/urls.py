from django.urls import path
from . import views

urlpatterns = [
    path('api/books/', views.get_books_json, name='get_books_json'),
    path('api/books/<int:book_id>/', views.book_details, name='book_details'),
    path('api/books/<int:book_id>/review/', views.add_review, name='add_review'),
    path('api/books/<int:book_id>/rate/', views.add_rating, name='add_rating'),
    path('api/books/<int:book_id>/take/', views.take_book, name='take_book'),
    path('api/books/<int:book_id>/return/', views.return_book, name='return_book'),
    path('api/user-borrow-history/', views.get_user_borrow_history, name='user-borrow-history'),
]
