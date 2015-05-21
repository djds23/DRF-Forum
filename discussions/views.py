from django.shortcuts import render_to_response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from discussions.models import Discussion, Comment
from serializers import DiscussionSerializer, CommentSerializer, DiscussionThreadSerializer


class DiscussionList(APIView):

    def get(self, request):
        comment_threads = Discussion.objects.all()
        serializer = DiscussionSerializer(comment_threads, many=True)
        return Response(serializer.data)

    def post(self, request):
        discussion = DiscussionSerializer(data=request.DATA)
        if discussion.is_valid():
            discussion.save()
            return Response(discussion.data, status=status.HTTP_201_CREATED)
        return Response(discussion.errors, status=status.HTTP_400_BAD_REQUEST)


class DiscussionDetail(APIView):

    def get(self, request, discussion_id):
        if not discussion_id:
            return Response({'error': 'please provide a thread id.'}, status=status.HTTP_400_BAD_REQUEST)
        discussion = Discussion.objects.filter(id=discussion_id)
        serializer = DiscussionThreadSerializer(discussion, many=True)
        return Response(serializer.data)


class NewDiscussionComment(APIView):

    def post(self, request):
        comment = CommentSerializer(data=request.DATA)
        if comment.is_valid():
            comment.save()
            return Response(comment.data, status=status.HTTP_201_CREATED)
        return Response(comment.errors, status=status.HTTP_400_BAD_REQUEST)


class VoteComment(APIView):

    def post(self, request, direction, comment_id):
        if comment_id:
            try:
                comment = Comment.objects.get(id=comment_id)
            except Comment.DoesNotExist:
                return Response({'error': 'comment does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

            if direction == 'up':
                comment.score += 1
            elif direction == 'down':
                comment.score -= 1
            else:
                return Response({'error': 'invalid direction'}, status=status.HTTP_400_BAD_REQUEST)

            comment.save()
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            return Response({'error': 'please provide a comment id.'}, status=status.HTTP_400_BAD_REQUEST)

def site_root(request):
    return render_to_response(
        'base.html',
    )
