from django.db import models
from django.utils import timezone
import datetime

class Question(models.Model):
    que_txt = models.CharField(max_length = 300)
    pub_date = models.DateTimeField("Date Published")
    def __str__(self):
        return self.que_txt
    
    def was_published_recently(self):
        return self.pub_date >= timezone.now() 
    
datetime.timedelta(days=1)

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete = models.CASCADE)
    choice_txt = models.CharField(max_length = 150)
    votes = models.IntegerField(default=0)
    def __str__(self):
        return self.choice_txt

# Create your models here.
