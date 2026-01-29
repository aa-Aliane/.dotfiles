Çfrom rest_framework import serializers
from apps.repairs.models import Repair


class RepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repair
        fields = "__all__"
Ç*cascade082[file:///home/amine/coding/web/tek-mag/backend/apps/repairs/serializers/repair_serializer.py