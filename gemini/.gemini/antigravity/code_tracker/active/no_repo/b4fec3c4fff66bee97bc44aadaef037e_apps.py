‡from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    class Meta:
        app_label = "accounts"

    def ready(self):
        import apps.accounts.signals  # noqa
‡ *cascade082Cfile:///home/amine/coding/web/tek-mag/backend/apps/accounts/apps.py