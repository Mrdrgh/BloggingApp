from  rest_framework import serializers
from .models import Blog, Profile, Friendship
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', "username", "password"]
        extra_kwargs= {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user



class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')
    class Meta:
        model= Profile
        fields= ['id', 'user', 'bio', 'friends', 'profile_picture']



class FriendshipSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    friend = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ['id', 'user', 'friend', 'created_at']

    def get_user(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.friend:
            return obj.friend.username
        return obj.user.username

    def get_friend(self, obj):
        request = self.context.get('request')
        if request and request.user == obj.friend:
            return obj.user.username
        return obj.friend.username


class BlogSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'created_at', 'author_username', 'author']
        extra_kwargs = {'author': {'read_only': True}}