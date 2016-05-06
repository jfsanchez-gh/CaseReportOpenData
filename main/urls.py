"""CaseReportOpenData URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url, include
from django.conf import settings
from main import views

app_name = 'main'

urlpatterns = [
	url(r'^$', views.index, {'onlyChart': False, 'sickness': 'all'}, name='index'),
	url(r'^(?P<sickness>[CDZ]{1})/$', views.index, {'onlyChart': False}, name='index'),
	url(r'^chart/main/$', views.index, {'onlyChart': True, 'sickness': 'all'}, name='main_chart'),
	url(r'^chart/main/(?P<sickness>[CDZ]{1})/$', views.index, {'onlyChart': True}, name='main_chart'),
]
