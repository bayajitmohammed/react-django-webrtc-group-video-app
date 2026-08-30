from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Room, User


class RoomInline(admin.TabularInline):
    model = Room
    extra = 0
    fields = ('title', 'room_type', 'slug', 'created_at')
    readonly_fields = ('slug', 'created_at')
    show_change_link = True


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ('email',)
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        (
            'Permissions',
            {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')},
        ),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active'),
            },
        ),
    )
    inlines = [RoomInline]


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'room_type', 'created_at')
    list_filter = ('room_type',)
    search_fields = ('title', 'owner__email')
    readonly_fields = ('slug', 'created_at', 'updated_at')
