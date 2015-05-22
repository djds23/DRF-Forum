# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('discussions', '0006_auto_20150521_1419'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='score',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='comment',
            name='username',
            field=models.CharField(default=b'Anonymous', max_length=255, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='discussion',
            name='username',
            field=models.CharField(default=b'Anonymous', max_length=255, blank=True),
        ),
    ]
