¸from rest_framework import serializers
from ..models import Brand

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'
¸2Lfile:///home/amine/coding/web/tek-mag/backend/apps/tech/serializers/brand.py