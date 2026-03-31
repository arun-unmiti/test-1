from ..models import TblExpTillage
from ..serializers import TblExpTillageSerializer
from rest_framework.response import Response
from django.db.models import Q, Count, Sum
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class UtilExpTillage:
    def read_single(self, **kwargs):
        item_id = kwargs.get("id")
        data_id = kwargs.get("data_id")
        if item_id:
            queryobj = TblExpTillage.objects.filter(pk=item_id).first()
        elif data_id:
            queryobj = TblExpTillage.objects.filter(data_id=data_id).first()
        else:
            queryobj = None
        if not queryobj:
            return Response({"success": 0, "message": "The requested record is not found under tillage expense"}, status=404)
        data = TblExpTillageSerializer(queryobj, many=False).data
        return Response({"success": 1, "data": data}, status=200)

    def read_summary(self, **kwargs):
        adm0_id = kwargs.get("adm0_id")
        adm1_id = kwargs.get("adm1_id")
        adm2_id = kwargs.get("adm2_id")
        adm3_id = kwargs.get("adm3_id")
        adm4_id = kwargs.get("adm4_id")
        crop_id = kwargs.get("crop_id")
        queryset = TblExpTillage.objects.all()
        if adm0_id: queryset = queryset.filter(farm__field_5016__pk=adm0_id)
        if adm1_id: queryset = queryset.filter(farm__field_5017__pk=adm1_id)
        if adm2_id: queryset = queryset.filter(farm__field_5018__pk=adm2_id)
        if adm3_id: queryset = queryset.filter(farm__field_5019__pk=adm3_id)
        if adm4_id: queryset = queryset.filter(farm__field_5020__pk=adm4_id)
        if crop_id: queryset = queryset.filter(crop__field_5027__pk__in=crop_id)
        agg = queryset.aggregate(records=Count('id'), total_amount=Sum('field_5082'))
        return Response({"success": 1, "data": {
            "records": agg['records'] or 0,
            "total_amount": round(agg['total_amount'] or 0, 2),
        }}, status=200)

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
        crop_id = kwargs.get("crop_id")
        queryset = TblExpTillage.objects.all()
        if search_for:
            queryset = queryset.filter(
                Q(field_5077__icontains=search_for)
                | Q(field_5078__icontains=search_for)
                | Q(field_5080__label__icontains=search_for)
                | Q(field_5081__label__icontains=search_for)
                | Q(crop__field_5027__crop_name__icontains=search_for)
            )
        if adm0_id: queryset = queryset.filter(farm__field_5016__pk=adm0_id)
        if adm1_id: queryset = queryset.filter(farm__field_5017__pk=adm1_id)
        if adm2_id: queryset = queryset.filter(farm__field_5018__pk=adm2_id)
        if adm3_id: queryset = queryset.filter(farm__field_5019__pk=adm3_id)
        if adm4_id: queryset = queryset.filter(farm__field_5020__pk=adm4_id)
        if crop_id: queryset = queryset.filter(crop__field_5027__pk__in=crop_id)

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

            data = TblExpTillageSerializer(page_obj.object_list, many=True).data
            return Response({
                "success": 1,
                "count": paginator.count,
                "next": page_obj.next_page_number() if page_obj.has_next() else None,
                "previous": page_obj.previous_page_number() if page_obj.has_previous() else None,
                "data": data
            }, status=200)
        else:
            data = TblExpTillageSerializer(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)
