from main import models



def roboot_insert_municipality():
	f = open('tmp/mun.txt','r')
	for line in f.readlines():
		str_country,str_state,str_municipality = line.split(',')
		print('Country=%s, State=%s, Municipality=%s' %(str_country, str_state, str_municipality))
		country = models.Country.objects.get(name=str_country)

		state,saved = models.State.objects.get_or_create(name=str_state, country=country)
		state.save()

		municupality,saved = models.Municipality.objects.get_or_create(name=str_municipality, state=state)
		municupality.save()

		country.save()


	f.close()



import random

def roboot_insert_random_cases():
	for k in range(1,200):
		last = models.Municipality.objects.count() - 1
		index1 = random.randint(0, last)
		municipality = models.Municipality.objects.all()[index1]

		last = models.Center.objects.count() - 1
		index1 = random.randint(0, last)
		center = models.Center.objects.all()[index1]

		if random.randint(0,1) == 0:
			recovered = True
		else:
			recovered = False

		case = models.Case(
			sickness=random.choice(models.SICKNESS_CHOICE)[0],
			age=random.randint(0,130),
			sex=random.choice(models.SEX_CHOICE)[0],
			municipality=municipality,
			center=center,
			recovered=recovered
		)
		case.save()


def roboot_insert_countries():
	f = open('tmp/countries.txt','r')
	for line in f.readlines():
		if line.endswith('\n'):
			line = line.replace('\n','')
		if '(' in line and ')' in line:
			first = line.index('(')
			last = line.index(')')
			line = line[0:first] + line[last+1:]
		str_code,str_name = line.split(';')
		country,saved = models.Country.objects.get_or_create(name=str_name, code=str_code)
		country.save()
		# print('code=%s, name=%s' %(str_code, str_name))

	f.close()



def roboot_insert_center():
	