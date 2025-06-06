from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthenticatedWithAuth0

class PostListCreateView(APIView):
    permission_classes = [IsAuthenticatedWithAuth0]

    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')
        return Response(PostSerializer(posts, many=True).data)

    def post(self, request):
        user_sub = request.user.sub
        post = Post.objects.create(user_sub=user_sub, content=request.data.get("content"))
        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)
