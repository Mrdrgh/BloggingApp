from django.urls import path
from .views import *
urlpatterns = [
    path('blogs/', BlogListCreate.as_view(), name='create_blog'),
    path('featured-blogs/', FeaturedBlogsList.as_view(), name='featured_blogs'),
    path('blogs/<str:author>/', BlogList.as_view(), name='list_blog'),
    #TODO add page for searched user blogs
    path('blogs/update/<int:pk>/', BlogUpdate.as_view(), name='update_blog'),
    path('blogs/delete/<int:pk>/', BlogDelete.as_view(), name='delete_blog'),
    path('profile/', ProfileDetail.as_view(), name='profile_detail'),
    path('user_blogs/', UserBlogsList.as_view(), name='user_blogs'),
    path('friendships/', FriendshipListCreate.as_view()),
    path('friendships/<int:pk>/', FriendshipCreate.as_view()),
    path('friendships/delete/<int:pk>/', FriendshipDelete.as_view()),
]