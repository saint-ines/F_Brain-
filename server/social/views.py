from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    """
    Vue de test pour vérifier l'authentification Auth0
    """
    return Response({
        'message': 'Authentification réussie !',
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
        }
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def public_endpoint(request):
    """
    Endpoint public pour tester sans authentification
    """
    return Response({
        'message': 'Ceci est un endpoint public',
        'status': 'accessible sans authentification'
    }, status=status.HTTP_200_OK)