from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello Anant this side . Welcome to polls index.")

# Create your views here.