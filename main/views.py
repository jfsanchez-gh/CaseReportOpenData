from django.shortcuts import render
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from . import models

def index(request, onlyChart):
	ctx = {}
	aux = {}
	aux2 = {}
	for case in models.Case.objects.all():
		code = case.municipality.state.country.code
		year = case.date.year
		if aux.has_key(code) and aux[code].has_key(year):
			aux[code][year] += 1
		else:
			aux[code] = {year : 1}

		if aux2.has_key(year):
			aux2[year] += 1
		else:
			aux2[year] = 1

	world = []
	for year in aux2:
		world.append([year, aux2[year]])

	countries = {}
	data = []
	for code in aux:
		code_data = []
		count = 0
		for year in aux[code]:
			code_data.append([year, aux[code][year]])
			count += aux[code][year]
		data.append({'code3': code, 'value':count})
		countries[code]={
			'code3': code,
			'data': code_data
		}


	ctx['main_world'] = {'data': data, 'all': world, 'countries': countries}

	if not onlyChart:
		return render(request, 'main/index.html', ctx)
	else:
		return render(request, 'main/charts/main_chart.html', ctx)