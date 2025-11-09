from django.contrib import admin
from .models import Team, UserProfile, Activity, Workout, LeaderboardEntry

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'hero_alias', 'team')
    search_fields = ('user__username', 'hero_alias')
    list_filter = ('team',)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'duration_minutes', 'distance_km', 'calories', 'timestamp')
    list_filter = ('activity_type', 'timestamp')
    search_fields = ('user__username',)

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'difficulty')
    list_filter = ('difficulty',)
    search_fields = ('name',)

@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'timeframe', 'rank', 'total_points', 'updated_at')
    list_filter = ('timeframe',)
    search_fields = ('user__username',)
