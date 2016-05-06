from __future__ import unicode_literals

from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator



SEX_CHOICE = (
    ('M', 'Male'),
    ('F', 'Female'),
)

SICKNESS_CHOICE = (
	('Z','Zika'),
	('D','Dengue'),
	('C','Chikungunya')
)


class Case(models.Model):
	sickness = models.CharField(
		max_length=1, 
		choices=SICKNESS_CHOICE,
	)
	age = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
	sex = models.CharField(
		max_length=1, 
		choices=SEX_CHOICE,
	)
	municipality = models.ForeignKey('Municipality')
	center = models.ForeignKey('Center')
	recovered = models.BooleanField() #True -> yes
	date = models.DateTimeField(auto_now_add=True)

	class Meta:
		verbose_name = "Case"
		verbose_name_plural = "Cases"

	def __unicode__(self):
		return '%s-%s-%s-%s-%s-%s' %(self.age, self.sex, self.municipality, 
									self.center, self.recovered, self.date)


class Municipality(models.Model):

	name = models.CharField(max_length=144, unique=True)
	state = models.ForeignKey('State')

	class Meta:
		verbose_name = "Municipality"
		verbose_name_plural = "Municipalities"

	def __unicode__(self):
		return self.name



class Center(models.Model):
	name = models.CharField(max_length=144,unique=True)
	address = models.CharField(max_length=255)

	class Meta:
		verbose_name = "Center"
		verbose_name_plural = "Centers"

	def __unicode__(self):
		return self.name



class Country(models.Model):
	name = models.CharField(max_length=144)
	code = models.CharField(max_length=3, unique=True)

	class Meta:
		verbose_name = "Country"
		verbose_name_plural = "Countries"

	def __unicode__(self):
		return self.code


class State(models.Model):
	name = models.CharField(max_length=144,unique=True)
	country = models.ForeignKey('Country')

	class Meta:
		verbose_name = "State"
		verbose_name_plural = "States"

	def __unicode__(self):
		return self.name
    