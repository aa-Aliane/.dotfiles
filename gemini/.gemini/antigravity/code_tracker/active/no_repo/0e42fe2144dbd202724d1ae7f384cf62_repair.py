·from django.db import models
from django.conf import settings
from tech.models import ProductModel
from decimal import Decimal

class Repair(models.Model):
    uid = models.CharField(max_length=255, unique=True, verbose_name="Repair UID")
    date = models.DateField(verbose_name="Repair Date")
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="repairs",
        verbose_name="Client",
    )
    product_model = models.ForeignKey(
        ProductModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="repairs",
        verbose_name="Product Model",
    )
    description = models.TextField(verbose_name="Description of Breakdown")
    password = models.CharField(max_length=255, blank=True, null=True, verbose_name="Device Password")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"), verbose_name="Price")
    card_payment = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"), verbose_name="Card Payment")
    cash_payment = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"), verbose_name="Cash Payment")
    comment = models.TextField(blank=True, null=True, verbose_name="Comment")
    device_photo = models.ImageField(upload_to="repair_photos/", blank=True, null=True, verbose_name="Device Photo")
    file = models.FileField(upload_to="repair_files/", blank=True, null=True, verbose_name="Attached File")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Repair"
        verbose_name_plural = "Repairs"
        ordering = ["-date", "client"]

    def __str__(self):
        return f"Repair {self.uid} for {self.client.username}"
· 2Kfile:///home/amine/coding/web/tek-mag/backend/apps/repairs/models/repair.py