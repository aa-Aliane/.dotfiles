Êfrom rest_framework import serializers
from apps.tech.models import Supplier


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"
Ê*cascade082Ofile:///home/amine/coding/web/tek-mag/backend/apps/tech/serializers/supplier.py