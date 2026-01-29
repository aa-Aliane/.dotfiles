ôfrom django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RepairViewSet

router = DefaultRouter()
router.register(r'repairs', RepairViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
ô*cascade082Bfile:///home/amine/coding/web/tek-mag/backend/apps/repairs/urls.py