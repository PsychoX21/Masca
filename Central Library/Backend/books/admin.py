from django.contrib import admin
from .models import Book, BorrowHistory, Rating, Review

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('book_name', 'cover_page', 'author_name', 'published_year', 'subject', 'total_copies', 'available_copies', 'location')
    search_fields = ('book_name', 'author_name')
    list_filter = ('published_year', 'subject')

@admin.register(BorrowHistory)
class BorrowHistoryAdmin(admin.ModelAdmin):
    list_display = ('book', 'username', 'borrow_date', 'return_date')
    search_fields = ('book__book_name', 'username')
    list_filter = ('borrow_date', 'return_date')

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('book', 'username', 'score', 'rated_at')
    search_fields = ('book__book_name', 'username')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('book', 'username', 'created_at')
    search_fields = ('book__book_name', 'username')
