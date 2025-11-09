from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from octofit_tracker.models import Team, UserProfile, Activity, Workout, LeaderboardEntry

User = get_user_model()

HEROES = {
    'Marvel': [
        ('ironman', 'Tony Stark', 'Iron Man'),
        ('captainamerica', 'Steve Rogers', 'Captain America'),
        ('blackwidow', 'Natasha Romanoff', 'Black Widow'),
        ('thor', 'Thor Odinson', 'Thor'),
    ],
    'DC': [
        ('batman', 'Bruce Wayne', 'Batman'),
        ('superman', 'Clark Kent', 'Superman'),
        ('wonderwoman', 'Diana Prince', 'Wonder Woman'),
        ('flash', 'Barry Allen', 'Flash'),
    ]
}

WORKOUTS = [
    {
        'name': 'Hero Warmup',
        'description': 'Dynamic warmup sequence for heroes.',
        'difficulty': 'easy',
        'exercises': [
            {'name': 'Jumping Jacks', 'reps': 30},
            {'name': 'Arm Circles', 'reps': 20},
        ]
    },
    {
        'name': 'Avenger Endurance',
        'description': 'Cardio and stamina booster.',
        'difficulty': 'moderate',
        'exercises': [
            {'name': 'Run', 'distance_km': 5},
            {'name': 'Burpees', 'reps': 40},
        ]
    },
    {
        'name': 'Justice Strength',
        'description': 'Strength focus routine.',
        'difficulty': 'hard',
        'exercises': [
            {'name': 'Deadlift', 'sets': 5, 'reps': 5},
            {'name': 'Bench Press', 'sets': 5, 'reps': 5},
        ]
    }
]

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting population of octofit_db...'))
        with transaction.atomic():
            # Clear existing data (order matters due to FKs)
            LeaderboardEntry.objects.all().delete()
            Activity.objects.all().delete()
            UserProfile.objects.all().delete()
            Team.objects.all().delete()
            Workout.objects.all().delete()
            # Do not delete users blindly; only users we created previously
            for username in [u[0] for team in HEROES.values() for u in team]:
                User.objects.filter(username=username).delete()

            # Create Teams
            teams = {}
            for team_name in HEROES.keys():
                team_obj = Team.objects.create(name=team_name, description=f'{team_name} Heroes Team')
                teams[team_name] = team_obj
                self.stdout.write(self.style.SUCCESS(f'Created team {team_name}'))

            # Create Users and Profiles
            for team_name, heroes in HEROES.items():
                for username, real_name, alias in heroes:
                    email = f'{username}@heroes.test'
                    user = User.objects.create_user(username=username, email=email, password='pass1234', first_name=real_name.split()[0], last_name=' '.join(real_name.split()[1:]))
                    profile = UserProfile.objects.create(user=user, hero_alias=alias, team=teams[team_name], bio=f'{alias} of {team_name}')
                    self.stdout.write(self.style.SUCCESS(f'Created user {username} / alias {alias}'))

            # Create Workouts
            for w in WORKOUTS:
                workout = Workout.objects.create(**w)
                self.stdout.write(self.style.SUCCESS(f'Created workout {workout.name}'))

            # Create Activities (one per user)
            for profile in UserProfile.objects.select_related('user', 'team').all():
                Activity.objects.create(
                    user=profile.user,
                    team=profile.team,
                    activity_type='run',
                    duration_minutes=30,
                    distance_km=5.5,
                    calories=400,
                )
            self.stdout.write(self.style.SUCCESS('Created activities for all users'))

            # Compute simple leaderboard points (duration + calories for demo)
            for profile in UserProfile.objects.select_related('user').all():
                activities = profile.user.activities.all()
                total_points = sum(a.duration_minutes + a.calories for a in activities)
                LeaderboardEntry.objects.create(
                    user=profile.user,
                    total_points=total_points,
                    rank=0,  # rank will be assigned later
                    timeframe='daily'
                )

            # Assign ranks based on total_points
            entries = LeaderboardEntry.objects.order_by('-total_points')
            for idx, entry in enumerate(entries, start=1):
                entry.rank = idx
                entry.save(update_fields=['rank'])

            self.stdout.write(self.style.SUCCESS('Leaderboard entries created and ranked'))

        self.stdout.write(self.style.SUCCESS('Population complete.'))
