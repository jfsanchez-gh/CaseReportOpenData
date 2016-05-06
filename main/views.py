from django.shortcuts import render
from django.http import JsonResponse
import json
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from . import models

def index(request, onlyChart, sickness):
	ctx = {}
	aux = {}
	aux2 = {}
	if sickness == 'all':
		queryset = models.Case.objects.all()
	else:
		queryset = models.Case.objects.filter(sickness=sickness)
	for case in queryset:
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

	ctx['main_world'] = {
		'data': data,
		'all': world,
		'countries': countries
	}

	world = {}
	countries_data = {}
	for case in queryset:
		code = case.municipality.state.country.code
		year = case.date.year
		if countries_data.has_key(code) and countries_data[code].has_key(year):
			if case.age < 13:
				countries_data[code][year][0] += 1
			elif case.age < 19:
				countries_data[code][year][1] += 1
			elif case.age < 31:
				countries_data[code][year][2] += 1
			else:
				countries_data[code][year][3] += 1
		else:
			aux = [0, 0, 0, 0]
			if case.age < 13:
				aux[0] = 1
			elif case.age < 19:
				aux[1] = 1
			elif case.age < 31:
				aux[2] = 1
			else:
				aux[3] = 1
			countries_data[code] = {year: aux}

		if world.has_key(year):
			if case.age < 13:
				world[year][0] += 1
			elif case.age < 19:
				world[year][1] += 1
			elif case.age < 31:
				world[year][2] += 1
			else:
				world[year][3] += 1
		else:
			aux = [0, 0, 0, 0]
			if case.age < 13:
				aux[0] = 1
			elif case.age < 19:
				aux[1] = 1
			elif case.age < 31:
				aux[2] = 1
			else:
				aux[3] = 1
			world[year] = aux


	bar_chart_values = [[],[],[],[]]
	bar_chart_totals = [0, 0, 0, 0]
	for i in world.values():
		for j in range(4):
			bar_chart_values[j].append(i[j])
			bar_chart_totals[j] += i[j]

	countries_values = {}
	countries_totals = {}
	for code in countries_data:
		values = [[],[],[],[]]
		totals = [0, 0, 0, 0]
		for i in countries_data[code].values():
			for j in range(4):
				values[j].append(i[j])
				totals[j] += i[j]
		countries_values[code] = values
		countries_totals[code] = totals

	ctx['bar_chart'] = {
		'categories': world.keys(),
		'data': bar_chart_values,
		'totals': bar_chart_totals,
		'countries_values': countries_values,
		'countries_totals': countries_totals
	}

	aux = {}
	aux2={}
	for case in queryset.filter(recovered=False):
		code = case.municipality.state.country.code
		date = json.dumps(case.date.isoformat())
		if aux.has_key(code) and aux[code].has_key(date):
			aux[code][date].append(case.age)
		else:
			aux[code] = {date : [case.age]}

		if aux2.has_key(date):
			aux2[date].append(case.age)
		else:
			aux2[date] = [case.age]

	not_recovered_total = []
	for date in aux2:
		for age in aux2[date]:
			not_recovered_total.append([date, age])
	countries_values = {}
	countries_total = []
	'''for code in aux:
		code_data = []
		count = 0
		for year in aux[code]:
			code_data.append([date, aux[code][year]])
			count += aux[code][date]
		countries_total.append({'code3': code, 'value':count})
		countries_values[code]={
			'code3': code,
			'data': code_data
		}'''

	ctx['scatter_chart'] = {
		'total': not_recovered_total,
		'countries_values': countries_values,
		'countries_totals': countries_totals
	}


	if not onlyChart:
		return render(request, 'main/index.html', ctx)
	else:
		return render(request, 'main/charts/main_chart.html', ctx)