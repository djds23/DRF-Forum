# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('discussions', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='CommentThread',
            new_name='Discussion',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='comment_parent',
        ),
    ]
