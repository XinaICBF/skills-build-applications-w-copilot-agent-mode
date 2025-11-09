from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Team, UserProfile, Activity, Workout, LeaderboardEntry
from .serializers import (
    TeamSerializer,
    UserProfileSerializer,
    ActivitySerializer,
    WorkoutSerializer,
    LeaderboardEntrySerializer,
)

User = get_user_model()

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all().order_by('name')
    serializer_class = TeamSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.select_related('user', 'team').all()
    serializer_class = UserProfileSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.select_related('user', 'team').all().order_by('-timestamp')
    serializer_class = ActivitySerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all().order_by('name')
    serializer_class = WorkoutSerializer

class LeaderboardEntryViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardEntry.objects.select_related('user').all().order_by('rank')
    serializer_class = LeaderboardEntrySerializer

@api_view(['GET'])
def api_root(request, format=None):
    from rest_framework.reverse import reverse
    return Response({
        'teams': reverse('team-list', request=request, format=format),
        'users': reverse('userprofile-list', request=request, format=format),
        'activities': reverse('activity-list', request=request, format=format),
        'workouts': reverse('workout-list', request=request, format=format),
        'leaderboard': reverse('leaderboardentry-list', request=request, format=format),
    })
