from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import UserAccount, Post

# Custom UserAdmin for UserAccount
class UserAccountAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'followers', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)

# Register UserAccount with the customized admin interface
admin.site.register(UserAccount, UserAccountAdmin)

# Admin interface for Post
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'views')
    search_fields = ('title', 'author__email', 'author__first_name', 'author__last_name')
    list_filter = ('created_at', 'author')
    raw_id_fields = ('author',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

    def get_queryset(self, request):
        # Ensures the queryset optimizes database queries.
        queryset = super().get_queryset(request).select_related('author')
        return queryset

# Register Post with the customized admin interface
admin.site.register(Post, PostAdmin)
