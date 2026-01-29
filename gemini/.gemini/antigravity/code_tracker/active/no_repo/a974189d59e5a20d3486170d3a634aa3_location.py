Êfrom rest_framework import serializers
from apps.tech.models import Location


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"
Ê*cascade082Ofile:///home/amine/coding/web/tek-mag/backend/apps/tech/serializers/location.py