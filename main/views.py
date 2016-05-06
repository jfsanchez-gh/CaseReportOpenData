from django.shortcuts import render
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from . import models


def index(request):
	ctx = {}
	data = [
	{
	'code3': 'CAN',
	'value': 123,
	},
	{
	'code3': 'BRA',
	'value': 10000,
	},
	{
	'code3': 'EGY',
	'value': 15000,
	},
	];

	countries = {
	'CAN':{
	'code3': 'CAN',
	'data': [
	[1991, 234],
	[1992, 345],
	[1994, 234],
	[1995, 23],
	[1999, 234],
	[2000, 123],
	[2004, 123],
	[2007, 23],
	[2013, 234],
	]
	},
	'BRA':{
	'code3': 'BRA',
	'data': [
	[2001, 5],
	[2005, 344],
	[2010, 56],
	[2015, 343],
	]
	},
	'EGY':{
	'code3': 'EGY',
	'data': [
	[2000, 1],
	[2005, 32],
	[2007, 543],
	[2016, 3],
	]
	}
	};


	ctx['data'] = json.dumps(data)
	ctx['countries'] = json.dumps(countries)

	return render(request, 'main/index.html', ctx)


def main_chart(request):
	ctx = {}
	data = [
	{
	'code3': 'CAN',
	'value': 123,
	},
	{
	'code3': 'BRA',
	'value': 10000,
	},
	{
	'code3': 'EGY',
	'value': 15000,
	},
	];

	countries = {
	'CAN':{
	'code3': 'CAN',
	'data': [
	[1991, 234],
	[1992, 345],
	[1994, 234],
	[1995, 23],
	[1999, 234],
	[2000, 123],
	[2004, 123],
	[2007, 23],
	[2013, 234],
	]
	},
	'BRA':{
	'code3': 'BRA',
	'data': [
	[2001, 5],
	[2005, 344],
	[2010, 56],
	[2015, 343],
	]
	},
	'EGY':{
	'code3': 'EGY',
	'data': [
	[2000, 1],
	[2005, 32],
	[2007, 543],
	[2016, 3],
	]
	}
	};

	ctx['data'] = data
	ctx['countries'] = countries

	return render(request, 'main/charts/main_chart.html', ctx)