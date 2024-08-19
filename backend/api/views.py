from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from django.db.models import Q
from .models import Blog, Profile, Friendship
from rest_framework.pagination import PageNumberPagination

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []

    def perform_create(self, serializer):
        if serializer.is_valid():
            user = serializer.save()
            Profile.objects.create(
                user=user,
                bio='',
                username=user.username,
                profile_picture="profile_pictures/Blanc.jpg",
            )
        else:
            print(serializer.error)

class UserBlogsList(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Blog.objects.filter(author=user)

class BlogList(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]
    lookup_field= "author"

    def get_queryset(self):
        return Blog.objects.filter(user=self.request.user)

class BlogListCreate(generics.ListCreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        friends = Friendship.objects.filter(user=user).values_list('friend', flat=True)
        return Blog.objects.filter(author__in=[user] + list(friends))

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.error)


class FeaturedBlogsPagination(PageNumberPagination):
    page_size = 10

class FeaturedBlogsList(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]
    pagination_class = FeaturedBlogsPagination

    def get_queryset(self):
        return Blog.objects.all().order_by('-created_at')


class BlogUpdate(generics.UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Blog.objects.filter(author=user)


class BlogDelete(generics.DestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Blog.objects.filter(author=user)


class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes= [IsAuthenticated]


    def get_object(self):
        return Profile.objects.get(user=self.request.user)

from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status

class FriendshipCreate(generics.CreateAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        friend_id = self.kwargs.get('pk')
        try:
            friend = get_object_or_404(User, id=friend_id)
            
            # Check if friendship already exists
            existing_friendship = Friendship.objects.filter(
                (Q(user=request.user) & Q(friend=friend)) |
                (Q(user=friend) & Q(friend=request.user))
            ).first()
            
            if existing_friendship:
                return Response({"detail": "Friendship already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
            friendship = Friendship.objects.create(user=request.user, friend=friend)
            serializer = self.get_serializer(friendship)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"detail": f"User with id {friend_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class FriendshipListCreate(generics.ListCreateAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(
            Q(user=user) | Q(friend=user)
        )

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.friend == self.request.user:
            representation['friend'] = instance.user.username
        return representation

class FriendshipDelete(generics.DestroyAPIView):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(
            Q(user=user) | Q(friend=user)
        )

    def perform_destroy(self, instance):
        userProfile = Profile.objects.get(user=instance.user)
        friendProfile = Profile.objects.get(user=instance.friend)
        userProfile.friends -= 1
        friendProfile.friends -= 1
        userProfile.save()
        friendProfile.save()
        instance.delete()