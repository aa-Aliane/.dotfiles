Çfrom accounts.views.mobile_login_view import MobileLoginView
from dj_rest_auth.registration.views import VerifyEmailView
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("api/", include("accounts.urls")),
    path("api/tech/", include("tech.urls")),
    path("api/repairs/", include("repairs.urls")),
    path("api/auth/login/", MobileLoginView.as_view(), name="rest_login"),
    path("api/auth/", include("dj_rest_auth.urls")),
    path(
        "api/auth/account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
Ç *cascade082:file:///home/amine/coding/web/tek-mag/backend/conf/urls.py