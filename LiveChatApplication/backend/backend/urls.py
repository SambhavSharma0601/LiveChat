from django.contrib import admin
from django.urls import path
# from api.views import hello_api


urlpatterns = [
    path('admin/', admin.site.urls),
]
