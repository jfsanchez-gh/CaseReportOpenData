# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-05-06 07:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='code',
            field=models.CharField(default='', max_length=3, unique=True),
            preserve_default=False,
        ),
    ]
