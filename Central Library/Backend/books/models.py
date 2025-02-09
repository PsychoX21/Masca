from django.db import models

class Book(models.Model):
    book_name = models.CharField(max_length=200)
    author_name = models.CharField(max_length=100)
    cover_page = models.ImageField(upload_to='cover_page/', default='cover_page/default.webp')
    published_year = models.IntegerField()
    subject = models.CharField(max_length=50)  
    total_copies = models.IntegerField(default=1)
    available_copies = models.IntegerField(default=1)
    location = models.CharField(max_length=250)
    avg_rating = models.FloatField(default=0)
    ratings_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.book_name
    
    def take_book(self):
        if self.available_copies > 0:
            self.available_copies -= 1
            self.save()
            return True
        return False
    
    def return_book(self):
        if self.available_copies < self.total_copies:
            self.available_copies += 1
            self.save()
            return True
        return False

    def recalculate_avg_rating(self):
        ratings = self.ratings.all()
        total_ratings = ratings.count()

        if total_ratings == 0:
            self.avg_rating = 0
        else:
            total_score = sum(rating.score for rating in ratings)
            self.avg_rating = total_score / total_ratings

        self.ratings_count = total_ratings
        self.save()
    
class Rating(models.Model):
    book = models.ForeignKey(Book, related_name="ratings", on_delete=models.CASCADE)
    username = models.CharField(max_length=100, default="Anonymous")
    score = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])  
    rated_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('book', 'username')
    
class Review(models.Model):
    book = models.ForeignKey(Book, related_name="reviews", on_delete=models.CASCADE)
    username = models.CharField(max_length=100, default="Anonymous")
    review_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('book', 'username')

class BorrowHistory(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='borrow_history') 
    username = models.CharField(max_length=100, default="Anonymous")
    borrow_date = models.DateField(auto_now_add=True)  
    return_date = models.DateField(null=True, blank=True)  

    def mark_as_returned(self):
        self.return_date = models.DateField(auto_now=True)
        self.save()
        