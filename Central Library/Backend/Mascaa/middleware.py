from django.utils.deprecation import MiddlewareMixin
from rest_framework.authtoken.models import Token
from django.middleware.csrf import CsrfViewMiddleware
from django.http import JsonResponse
from django.urls import resolve

class CustomAuthMiddleware(MiddlewareMixin):

    def __init__(self, get_response=None):
        self.get_response = get_response
        self.csrf_middleware = CsrfViewMiddleware(get_response)
        super().__init__(get_response)

    # Define the URL names to skip
    SKIP_AUTH_URL_NAMES = [
        'login',
        'register',
        'get_books_json',
        'book_details',
    ]

    # Define the exact paths to skip
    SKIP_AUTH_PATHS = [
        '/admin/',
        '/media/',
    ]

    def process_request(self, request):
        # Skip authentication for specific URL names
        resolver_match = resolve(request.path_info)
        resolver_match = resolve(request.path_info)

        if resolver_match.url_name in self.SKIP_AUTH_URL_NAMES:
            return None
        
        # Skip authentication for specific paths
        if any(request.path.startswith(path) for path in self.SKIP_AUTH_PATHS):
            return None

        auth_token = request.META.get('HTTP_AUTHORIZATION')
        csrf_token = request.META.get('HTTP_X_CSRFTOKEN')
        
        if auth_token and csrf_token:
            auth_token_key = auth_token.split(' ')[1]  # Extract the token part from 'Token <token>'
            try:
                token = Token.objects.get(key=auth_token_key)
                request.user = token.user
                request.META['CSRF_COOKIE'] = csrf_token  # Set the CSRF token for further checks
            except Token.DoesNotExist:
                return JsonResponse({'error': 'Invalid token'}, status=401)
        else:
            return JsonResponse({'error': 'Token missing'}, status=401)

    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Skip CSRF check for specific URL names
        resolver_match = resolve(request.path_info)
        if resolver_match.url_name in self.SKIP_AUTH_URL_NAMES:
            return None
        
        # Skip CSRF check for specific paths
        if any(request.path.startswith(path) for path in self.SKIP_AUTH_PATHS):
            return None
        
        # Check CSRF token
        response = self.csrf_middleware.process_view(request, callback, callback_args, callback_kwargs)
        if response:
            return response
