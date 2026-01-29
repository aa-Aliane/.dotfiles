„from rest_framework import viewsets
from apps.tech.models import StockItem
from apps.tech.serializers import StockItemSerializer


class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.all()
    serializer_class = StockItemSerializer
„*cascade082Sfile:///home/amine/coding/web/tek-mag/backend/apps/tech/views/stock_item_viewset.py