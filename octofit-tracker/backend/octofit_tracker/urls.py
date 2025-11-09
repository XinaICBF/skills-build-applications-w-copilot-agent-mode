"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from .views import (
    TeamViewSet,
    UserProfileViewSet,
    ActivityViewSet,
    WorkoutViewSet,
    LeaderboardEntryViewSet,
)

router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'users', UserProfileViewSet, basename='userprofile')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'leaderboard', LeaderboardEntryViewSet, basename='leaderboardentry')

@api_view(['GET'])
def api_root(request, format=None):
    """Return fully-qualified API endpoint URLs using the Codespace host if available.

    We do this here (instead of modifying the original view in views.py) per requirements
    to avoid editing views.py while still presenting absolute URLs. If CODESPACE_NAME is
    not set, we fall back to the host of the incoming request.
    """
    codespace_name = os.environ.get("CODESPACE_NAME")
    if codespace_name:
        base = f"https://{codespace_name}-8000.app.github.dev"
    else:
        # request.build_absolute_uri('/') returns something like 'http://host/'
        base = request.build_absolute_uri('/')[:-1]

    # reverse without request returns relative paths like '/api/teams/'
    return Response({
        'teams': base + reverse('team-list'),
        'users': base + reverse('userprofile-list'),
        'activities': base + reverse('activity-list'),
        'workouts': base + reverse('workout-list'),
        'leaderboard': base + reverse('leaderboardentry-list'),
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
]
