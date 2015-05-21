# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('discussions', '0002_auto_20150521_1335'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='discussions',
            new_name='discussion',
        ),
    ]
