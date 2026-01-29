ÿfrom rest_framework import viewsets
from apps.tech.models import Location
from apps.tech.serializers import LocationSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
ÿ*cascade082Qfile:///home/amine/coding/web/tek-mag/backend/apps/tech/views/location_viewset.py