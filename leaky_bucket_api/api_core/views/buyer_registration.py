from ..models import TblCoreBuyer
from ..serializers import TblCoreBuyerSerializer
from rest_framework.response import Response
from django.db.models import Q, Count
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class UtilCoreBuyer:
    def read_single(self, **kwargs):
        item_id = kwargs.get("id")
        data_id = kwargs.get("data_id")
        if item_id:
            queryobj = TblCoreBuyer.objects.filter(pk=item_id).first()
        elif data_id:
            queryobj = TblCoreBuyer.objects.filter(data_id=data_id).first()
        else:
            queryobj = None
        if not queryobj:
            return Response({"success": 0, "message": "The requested record is not found under buyer registration"}, status=404)
        data = TblCoreBuyerSerializer(queryobj, many=False).data
        return Response({"success": 1, "data": data}, status=200)

    def read_summary(self, **kwargs):
        adm0_id = kwargs.get("adm0_id")
        adm1_id = kwargs.get("adm1_id")
        adm2_id = kwargs.get("adm2_id")
        adm3_id = kwargs.get("adm3_id")
        adm4_id = kwargs.get("adm4_id")
        queryset = TblCoreBuyer.objects.all()
        if adm0_id: queryset = queryset.filter(field_5043__pk=adm0_id)
        if adm1_id: queryset = queryset.filter(field_5044__pk=adm1_id)
        if adm2_id: queryset = queryset.filter(field_5045__pk=adm2_id)
        if adm3_id: queryset = queryset.filter(field_5046__pk=adm3_id)
        if adm4_id: queryset = queryset.filter(field_5047__pk=adm4_id)
        agg = queryset.aggregate(count=Count('id'))
        return Response({"success": 1, "data": {"count": agg['count'] or 0}}, status=200)

    def read_list(self, **kwargs):
        request = kwargs.get("request")
        page = kwargs.get("page")
        size = kwargs.get("size")
        search_for = kwargs.get("search_for")
        adm0_id = kwargs.get("adm0_id")
        adm1_id = kwargs.get("adm1_id")
        adm2_id = kwargs.get("adm2_id")
        adm3_id = kwargs.get("adm3_id")
        adm4_id = kwargs.get("adm4_id")
        queryset = TblCoreBuyer.objects.all()
        if search_for:
            queryset = queryset.filter(
                Q(field_5043__name__icontains=search_for)
                | Q(field_5044__name__icontains=search_for)
                | Q(field_5045__name__icontains=search_for)
                | Q(field_5046__name__icontains=search_for)
                | Q(field_5047__name__icontains=search_for)
                | Q(field_5048__label__icontains=search_for)
                | Q(field_5049__icontains=search_for)
                | Q(field_5050__icontains=search_for)
                | Q(field_5051__icontains=search_for)
            )
        if adm0_id: queryset = queryset.filter(field_5043__pk=adm0_id)
        if adm1_id: queryset = queryset.filter(field_5044__pk=adm1_id)
        if adm2_id: queryset = queryset.filter(field_5045__pk=adm2_id)
        if adm3_id: queryset = queryset.filter(field_5046__pk=adm3_id)
        if adm4_id: queryset = queryset.filter(field_5047__pk=adm4_id)

        if page and size:
            try:
                page_number = int(page)
                page_size = int(size)
            except (TypeError, ValueError):
                return Response({"success": 0, "message": "Invalid page or size"}, status=400)

            if page_number < 1 or page_size < 1:
                return Response({"success": 0, "message": "Page and size must be positive integers"}, status=400)

            # Ensure stable pagination order
            queryset = queryset.order_by("pk")

            paginator = Paginator(queryset, page_size)
            try:
                page_obj = paginator.page(page_number)
            except PageNotAnInteger:
                page_obj = paginator.page(1)
            except EmptyPage:
                page_obj = paginator.page(paginator.num_pages)

            data = TblCoreBuyerSerializer(page_obj.object_list, many=True).data
            return Response({
                "success": 1,
                "count": paginator.count,
                "next": page_obj.next_page_number() if page_obj.has_next() else None,
                "previous": page_obj.previous_page_number() if page_obj.has_previous() else None,
                "data": data
            }, status=200)
        else:
            data = TblCoreBuyerSerializer(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)
