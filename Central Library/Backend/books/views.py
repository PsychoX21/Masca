from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from django.forms.models import model_to_dict
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, authentication_classes, permission_classes
import json
from django.views.decorators.csrf import csrf_exempt

from .models import Book, Rating, Review, BorrowHistory

@api_view(['GET'])
def get_books_json(request):
    books = Book.objects.all()

    books_with_cover = []
    for book in books:
        book_data = model_to_dict(book)
        book_data['cover_page'] = request.build_absolute_uri(book.cover_page.url) if book.cover_page else None
        books_with_cover.append(book_data)
    
    return JsonResponse(books_with_cover, safe=False)

@api_view(['GET'])
def book_details(request, book_id):
    book = get_object_or_404(Book, pk=book_id)
    book_data = model_to_dict(book)
    book_data['cover_page'] = request.build_absolute_uri(book.cover_page.url) if book.cover_page else None

    reviews = list(book.reviews.values('username', 'review_text', 'created_at'))
    ratings = list(book.ratings.values('username', 'score', 'rated_at'))
    borrow_history = list(book.borrow_history.values('username', 'borrow_date', 'return_date'))
    
    return JsonResponse({'book': book_data, 'reviews': reviews, 'ratings': ratings, 'borrow_history': borrow_history})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_review(request, book_id):
    data = request.data
    user = request.user
    review_text = data.get('review')

    if not review_text:
        return JsonResponse({'error': 'Review text is required'}, status=400)

    book = get_object_or_404(Book, pk=book_id)
    if Review.objects.filter(book=book, username=user.Name).exists():
        return JsonResponse({'error': 'You have already reviewed this book.'}, status=400)

    Review.objects.create(book=book, username=user.Name, review_text=review_text)
    return JsonResponse({'success': 'Review added successfully'})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_rating(request, book_id):
    data = request.data
    user = request.user
    score = data.get('score')

    if score is None:
        return JsonResponse({'error': 'Score is required'}, status=400)

    book = get_object_or_404(Book, pk=book_id)
    rating, created = Rating.objects.update_or_create(
        book=book, username=user.Name,
        defaults={'score': score}
    )

    book.recalculate_avg_rating()
    message = "Rating added successfully" if created else "Rating updated successfully"
    return JsonResponse({'success': message})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def take_book(request, book_id):
    user = request.user
    book = get_object_or_404(Book, id=book_id)
    
    if book.take_book():
        BorrowHistory.objects.create(book=book, username=user.username, borrow_date=timezone.now())
        return JsonResponse({'success': f'You have borrowed {book.book_name}'})
    return JsonResponse({'error': 'No copies available'}, status=400)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def return_book(request, book_id):
    user = request.user
    book = get_object_or_404(Book, id=book_id)
    borrow_history = BorrowHistory.objects.filter(book=book, username=user.username, return_date__isnull=True).first()
    
    if borrow_history and book.return_book():
        borrow_history.return_date = timezone.now()
        borrow_history.save()
        return JsonResponse({'success': f'You have returned {book.book_name}'})
    return JsonResponse({'error': 'Error returning book'}, status=400)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_borrow_history(request):
    user = request.user
    borrow_history = BorrowHistory.objects.filter(username=user.username).select_related('book')
    
    history_data = [
        {
            'book_name': entry.book.book_name,
            'cover_page': request.build_absolute_uri(entry.book.cover_page.url) if entry.book.cover_page else None,
            'borrow_date': entry.borrow_date,
            'return_date': entry.return_date
        }
        for entry in borrow_history
    ]
    
    return JsonResponse(history_data, safe=False)
