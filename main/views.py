from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from . import models


def index(request):
	ctx = {}

	return render(request, 'main/index.html', ctx)