from rest_framework.serializers import ModelSerializer

from discussions.models import Discussion, Comment


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        ordering = ('score',)
        read_only_fields = ('score',)


class DiscussionSerializer(ModelSerializer):
    class Meta:
        model = Discussion
        ordering = ('update_ts',)


class DiscussionThreadSerializer(ModelSerializer):
    comment_set = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Discussion
        ordering = ('update_ts',)
        fields = ('comment_set', 'title', 'username', 'description', 'modified', 'created', 'id')
