from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import Team, UserProfile, Activity, Workout, LeaderboardEntry

User = get_user_model()

class APIRootTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', email='tester@example.com', password='pass1234')
        self.team = Team.objects.create(name='Marvel', description='Marvel Heroes')
        self.profile = UserProfile.objects.create(user=self.user, hero_alias='Iron Tester', team=self.team)
        self.workout = Workout.objects.create(name='Hero Warmup', difficulty='easy', description='Light intro', exercises=[{'name': 'Jumping Jacks', 'reps': 30}])
        self.activity = Activity.objects.create(user=self.user, team=self.team, activity_type='run', duration_minutes=25, distance_km=5.0, calories=300)
        self.entry = LeaderboardEntry.objects.create(user=self.user, total_points=150, rank=1, timeframe='daily')

    def test_api_root_lists_endpoints(self):
        url = reverse('api_root')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        for key in ['teams', 'users', 'activities', 'workouts', 'leaderboard']:
            self.assertIn(key, resp.data)

    def test_list_endpoints(self):
        endpoints = [reverse('team-list'), reverse('userprofile-list'), reverse('activity-list'), reverse('workout-list'), reverse('leaderboardentry-list')]
        for ep in endpoints:
            resp = self.client.get(ep)
            self.assertEqual(resp.status_code, 200)
            self.assertGreaterEqual(len(resp.data), 1)
