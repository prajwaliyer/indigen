# Generated by Django 5.0 on 2024-02-15 21:44

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_rename_thumbnail_post_thumbnail_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='useraccount',
            name='date_joined',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='post',
            name='views',
            field=models.IntegerField(default=1),
        ),
    ]
