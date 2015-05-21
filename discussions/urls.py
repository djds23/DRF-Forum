from django.conf.urls import url

from discussions.views import DiscussionList, DiscussionDetail, NewDiscussionComment, VoteComment

urlpatterns = [
    url(r'discussions/?$',
        view=DiscussionList.as_view(),
        name='discussion_list'),

    url(r'discussions/(?P<discussion_id>[0-9]+)/?$',
        view=DiscussionDetail.as_view(),
        name='discussion_detail'),

    url(r'new/comment/?$',
        view=NewDiscussionComment.as_view(),
        name='new_discussion_comment'),

    url(r'vote/(?P<direction>up|down)/(?P<comment_id>[0-9]+)/?$',
        view=VoteComment.as_view(),
        name='vote_comment'),
]
