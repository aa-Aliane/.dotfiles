ûfrom rest_framework import viewsets
from apps.repairs.models import Repair
from apps.repairs.serializers import RepairSerializer


class RepairViewSet(viewsets.ModelViewSet):
    queryset = Repair.objects.all()
    serializer_class = RepairSerializer
û*cascade082Rfile:///home/amine/coding/web/tek-mag/backend/apps/repairs/views/repair_viewset.py