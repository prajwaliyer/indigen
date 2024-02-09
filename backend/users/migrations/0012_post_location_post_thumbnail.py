# Generated by Django 5.0 on 2024-02-08 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_alter_post_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='thumbnail',
            field=models.URLField(blank=True, max_length=1024, null=True),
        ),
    ]
