from django.core.urlresolvers import reverse
from django.test import TestCase, Client

from discussions.models import Discussion, Comment


class TestCommentTree(TestCase):
    def test_thread_sorting(self):
        test_thread_1 = Discussion.objects.create(
            title='This1',
            username='that',
            description='the other thing',
        )
        test_thread_2 = Discussion.objects.create(
            title='This2',
            username='that',
            description='the other thing',
        )

        Comment.objects.create(
            discussion=test_thread_1,
            text='parent',
            username='guy1',
            score=1,
        )

        response = Client().get(reverse('discussion_list'))
        self.assertEqual(response.data[0]['id'], test_thread_1.id)
        self.assertEqual(response.data[1]['id'], test_thread_2.id)

    def test_vote_api(self):
        test_thread_1 = Discussion.objects.create(
            title='This1',
            username='that',
            description='the other thing',
        )

        comment = Comment.objects.create(
            discussion=test_thread_1,
            text='parent',
            username='guy1',
            score=0,
        )

        upvote = {
            "direction": "up",
            "comment_id": str(comment.id)
        }
        client = Client()
        client.post(reverse('vote_comment', kwargs=upvote))

        # Refresh comment from the database
        comment = Comment.objects.get(id=comment.id)

        self.assertEqual(comment.score, 1)

        downvote = {
            "direction": "down",
            "comment_id": str(comment.id)
        }
        client.post(reverse('vote_comment', kwargs=downvote))
        comment = Comment.objects.get(id=comment.id)

        self.assertEqual(comment.score, 0)
