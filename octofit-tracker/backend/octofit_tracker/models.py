from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    hero_alias = models.CharField(max_length=100, blank=True)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='members')
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.hero_alias or 'No Alias'})"

class Activity(models.Model):
    ACTIVITY_TYPES = [
        ('run', 'Run'),
        ('cycle', 'Cycle'),
        ('swim', 'Swim'),
        ('lift', 'Lift'),
        ('other', 'Other'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    duration_minutes = models.PositiveIntegerField(default=0)
    distance_km = models.FloatField(default=0.0)
    calories = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} {self.activity_type} @ {self.timestamp.isoformat()}"

class Workout(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('hard', 'Hard'),
        ('heroic', 'Heroic'),
    ]
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='easy')
    exercises = models.JSONField(default=list, help_text='List of exercise dicts')

    def __str__(self):
        return self.name

class LeaderboardEntry(models.Model):
    TIMEFRAME_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('all_time', 'All Time'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_entries')
    total_points = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=0)
    timeframe = models.CharField(max_length=20, choices=TIMEFRAME_CHOICES, default='daily')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'timeframe')

    def __str__(self):
        return f"{self.user.username} - {self.timeframe} #{self.rank}"
