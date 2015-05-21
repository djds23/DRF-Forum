from django.contrib import admin

from discussions.models import Discussion, Comment

class CommentAdmin(admin.ModelAdmin):
    list_display = ['username', 'text']


class CommentThreadAdmin(admin.ModelAdmin):
    list_display = ['title', 'username']


admin.site.register(Comment, CommentAdmin)
admin.site.register(Discussion, CommentThreadAdmin)