from ..models import TblCoreHerd, TblCoreFarm
from ..serializers import TblCoreHerdSerializer
from api_form.models import TblFormField
from django.utils.timezone import now, datetime
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q


class UtilCoreHerd:
    def read_single(self, **kwargs):
        data_id = kwargs.get("data_id")
        row_id = kwargs.get("row_id")
        queryobj = TblCoreHerd.objects.filter(data_id=data_id).first()
        if not queryobj:
            return Response({"success": 0, "message": "The requested record is not found under herd registration"}, status=404)
        data = TblCoreHerdSerializer(queryobj, many=False).data
        return Response({"success": 1, "data": data}, status=200)


    def read_list(self, **kwargs):
        request = kwargs.get("request")
        page = kwargs.get("page")
        size = kwargs.get("size")
        search_for = kwargs.get("search_for")
        loc_filter_criteria = kwargs.get("loc_filter_criteria")
        queryset = TblCoreHerd.objects.filter(loc_filter_criteria)
        # if search_for:
        #     search_criteria = (
        #         Q(field_5019__name__icontains=search_for)
        #         | Q(field_5020__name__icontains=search_for)
        #         | Q(field_5021__name__icontains=search_for)
        #         | Q(field_5022__name__icontains=search_for)
        #         | Q(field_5023__name__icontains=search_for)
        #         | Q(field_5024__farm_name__icontains=search_for)
        #         | Q(field_5025__icontains=search_for)
        #         | Q(field_5026__label__icontains=search_for)
        #     )
        #     queryset = queryset.filter(search_criteria)
        if page and size:
            paginator = PageNumberPagination()
            paginator.page_size = size
            page_queryset = paginator.paginate_queryset(queryset, request)
            data = TblCoreHerdSerializer(page_queryset, many=True).data
            return Response({
                "success": 1,
                "count": paginator.page.paginator.count,
                "next": paginator.get_next_link(),
                "previous": paginator.get_previous_link(),
                "data": data
            }, status=200)
        else:
            data = TblCoreHerdSerializer(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)

    
