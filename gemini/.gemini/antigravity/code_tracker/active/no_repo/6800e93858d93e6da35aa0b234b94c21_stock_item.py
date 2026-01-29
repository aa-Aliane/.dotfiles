ðfrom rest_framework import serializers
from apps.tech.models import StockItem


class StockItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    location_name = serializers.CharField(source="location.name", read_only=True)

    class Meta:
        model = StockItem
        fields = "__all__"
ð*cascade082Qfile:///home/amine/coding/web/tek-mag/backend/apps/tech/serializers/stock_item.py