from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Team, UserProfile, Activity, Workout, LeaderboardEntry

User = get_user_model()

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'description']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(source='user', queryset=User.objects.all(), write_only=True)
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(source='team', queryset=Team.objects.all(), write_only=True, allow_null=True, required=False)

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'user_id', 'hero_alias', 'team', 'team_id', 'bio']

class ActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(source='user', queryset=User.objects.all(), write_only=True)
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(source='team', queryset=Team.objects.all(), write_only=True, allow_null=True, required=False)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_id', 'team', 'team_id', 'activity_type', 'duration_minutes', 'distance_km', 'calories', 'timestamp']
        read_only_fields = ['timestamp']

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'difficulty', 'exercises']

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(source='user', queryset=User.objects.all(), write_only=True)

    class Meta:
        model = LeaderboardEntry
        fields = ['id', 'user', 'user_id', 'total_points', 'rank', 'timeframe', 'updated_at']
        read_only_fields = ['updated_at']
