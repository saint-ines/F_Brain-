from django.urls import path
from . import views

urlpatterns = [
    path('test-auth/', views.test_auth, name='test_auth'),
    path('public/', views.public_endpoint, name='public'),
  
]