"""
The urls file defines the endpoints for the core App on th backend.
"""
from django.urls import path
from .views import HealthCheckView

# Defines the mapping of endpoints and to views that are rendered for that endpoint
urlpatterns = [
    path("", HealthCheckView.as_view()),
]
