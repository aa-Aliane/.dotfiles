‰from rest_framework import viewsets
from apps.tech.models import StoreOrder
from apps.tech.serializers import StoreOrderSerializer


class StoreOrderViewSet(viewsets.ModelViewSet):
    queryset = StoreOrder.objects.all()
    serializer_class = StoreOrderSerializer
‰*cascade082Tfile:///home/amine/coding/web/tek-mag/backend/apps/tech/views/store_order_viewset.py