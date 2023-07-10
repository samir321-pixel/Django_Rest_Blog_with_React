from django.contrib import admin
from .models import *


class Nlog_Admin(admin.ModelAdmin):
    list_display = [field.name for field in BlogPost._meta.fields]
    filter_horizontal = ()
    list_filter = [field.name for field in BlogPost._meta.fields]
    fieldsets = ()


# Register your models here.
admin.site.register(BlogPost)