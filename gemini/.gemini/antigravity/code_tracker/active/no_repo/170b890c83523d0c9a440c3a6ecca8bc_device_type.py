úfrom rest_framework import viewsets

from ..models import DeviceType
from ..serializers import DeviceTypeSerializer


class DeviceTypeViewSet(viewsets.ModelViewSet):
    queryset = DeviceType.objects.all()
    serializer_class = DeviceTypeSerializer
ú2Lfile:///home/amine/coding/web/tek-mag/backend/apps/tech/views/device_type.py