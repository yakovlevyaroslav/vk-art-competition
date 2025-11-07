from django.urls import path
from . import views

urlpatterns = [
    path('application/', views.ApplicationView.as_view(), name='application'),
    path('vote/', views.VoteView.as_view(), name='vote'),
]
