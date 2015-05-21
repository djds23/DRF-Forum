from django.db import models
from django_extensions.db.models import TimeStampedModel


class Discussion(TimeStampedModel):

    title = models.CharField(
        max_length=255
    )
    username = models.CharField(
        max_length=255
    )
    description = models.CharField(
        max_length=1500
    )


class Comment(TimeStampedModel):

    discussion = models.ForeignKey(
        Discussion,
    )

    text = models.CharField(
        max_length=3000
    )
    username = models.CharField(
        default="Anonymous",
        max_length=255,
        null=True,
        blank=True,
    )

    score = models.IntegerField(
        default=0,
    )

    def save(self, *args, **kwargs):
        # save discussion ForeignKey for update_ts
        self.discussion.save()
        super(Comment, self).save(*args, **kwargs)
