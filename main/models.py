from __future__ import unicode_literals

from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.


SEX_CHOICE = (
    ('M', 'Male'),
    ('F', 'Female'),
)

class Case(models.Model):

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

	name = models.CharField(max_length=144)
	state = models.ForeignKey('State')

	class Meta:
		verbose_name = "Municipality"
		verbose_name_plural = "Municipalities"

	def __unicode__(self):
		return self.name



class Center(models.Model):
	name = models.CharField(max_length=144)
	address = models.CharField(max_length=255)

	class Meta:
		verbose_name = "Center"
		verbose_name_plural = "Centers"

	def __unicode__(self):
		return self.name



class Country(models.Model):
	name = models.CharField(max_length=144)

	class Meta:
		verbose_name = "Country"
		verbose_name_plural = "Countries"

	def __unicode__(self):
		return self.name


class State(models.Model):
	name = models.CharField(max_length=144)

	class Meta:
		verbose_name = "State"
		verbose_name_plural = "States"

	def __unicode__(self):
		return self.name
    