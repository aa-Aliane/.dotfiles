ÿfrom rest_framework import viewsets
from apps.tech.models import Supplier
from apps.tech.serializers import SupplierSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
ÿ*cascade082Qfile:///home/amine/coding/web/tek-mag/backend/apps/tech/views/supplier_viewset.py