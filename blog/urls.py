from django.urls import path
from .views import BlogPostListCreateAPIView, BlogPostRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('blogposts/', BlogPostListCreateAPIView.as_view(), name='blogpost-list-create'),
    path('blogposts/<int:pk>/', BlogPostRetrieveUpdateDestroyAPIView.as_view(),
         name='blogpost-retrieve-update-destroy'),
]
