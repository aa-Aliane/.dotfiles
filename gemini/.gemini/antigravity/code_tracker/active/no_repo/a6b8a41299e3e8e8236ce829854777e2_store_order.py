£from rest_framework import serializers
from apps.tech.models import StoreOrder


class StoreOrderSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source="supplier.name", read_only=True)

    class Meta:
        model = StoreOrder
        fields = "__all__"
£*cascade082Rfile:///home/amine/coding/web/tek-mag/backend/apps/tech/serializers/store_order.py