from typing import Any, Iterable
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Create your models here.
class Blog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateField(auto_now_add=True)

    def __str__(self) -> str:
        return self.author.username + ': ' + self.title

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures')
    bio = models.TextField()
    username = models.CharField(max_length=100)
    friends = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.username

class Friendship(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'friend'], name='unique_friendship')
        ]

    def save(self, force_insert: bool = ..., force_update: bool = ..., using: str | None = ..., update_fields: Iterable[str] | None = ...) -> None:
        if self.user == self.friend:
            raise ValidationError("cannot be friend of yourself")
        if Friendship.objects.filter(user=self.friend, friend=self.user).exists():
            raise ValidationError("friendship already exists")
        else:
            userProfile = Profile.objects.get(user=self.user)
            friendProfile = Profile.objects.get(user=self.friend)
            userProfile.friends += 1
            friendProfile.friends += 1
            userProfile.save()
            friendProfile.save()
            super().save()


    def __str__(self) -> str:
        return f'{self.user} - {self.friend}'