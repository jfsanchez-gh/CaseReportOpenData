from django.shortcuts import render
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from . import models



def sum_infest_by_country():
	data = []
	for case in models.Case.objects.all():
		code = case.municipality.state.country.code
		value = models.Case.objects.filter(municipality=case.municipality).count()
		item = {
			'code3' : code,
			'value' : value
		}
		data.append(item)

	return data



def index(request):
	ctx = {}
	# data = sum_infest_by_country()

	aux = {}
	aux2 = {}
	for case in models.Case.objects.all():
		code = case.municipality.state.country.code
		year = case.date.year
		if aux.has_key(code) and auc[code].has_key(year):
			aux[code][year] += 1
		else:
			aux[code][year] = 1

		if aux2.has_key(year):
			aux2[year] += 1
		else
			aux2[year] = 1
		if not aux[code][year]:

	world = []
	for year in aux2:
		world.append([year, aux2[year]])

	country = {}
	data = []
	for code in aux:
		code_data = []
		count = 0
		for year in code:
			data.append(year, code[year])
			count += code[year]
		data.append({'code3': code, 'value':count})
		country[code]={
			'code3': code,
			'data': code_data
		}

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
	ctx['world'] = world
	ctx['countries'] = countries

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
