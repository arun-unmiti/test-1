from ..models import TblCoreFarm
from ..serializers import TblCoreFarmSerializer
from rest_framework.response import Response
from django.db.models import Q, Count, Sum, FloatField, Case, When, Value, ExpressionWrapper
from django.db.models.functions import Cast
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class UtilCoreFarm:
    def read_single(self, **kwargs):
        item_id = kwargs.get("id")
        data_id = kwargs.get("data_id")
        if item_id:
            queryobj = TblCoreFarm.objects.filter(pk=item_id).first()
        elif data_id:
            queryobj = TblCoreFarm.objects.filter(data_id=data_id).first()
        else:
            queryobj = None
        if not queryobj:
            return Response({"success": 0, "message": "The requested record is not found under farm registration"}, status=404)
        data = TblCoreFarmSerializer(queryobj, many=False).data
        return Response({"success": 1, "data": data}, status=200)

    def read_summary(self, **kwargs):
        adm0_id = kwargs.get("adm0_id")
        adm1_id = kwargs.get("adm1_id")
        adm2_id = kwargs.get("adm2_id")
        adm3_id = kwargs.get("adm3_id")
        adm4_id = kwargs.get("adm4_id")
        queryset = TblCoreFarm.objects.all()
        if adm0_id: queryset = queryset.filter(field_5016__pk=adm0_id)
        if adm1_id: queryset = queryset.filter(field_5017__pk=adm1_id)
        if adm2_id: queryset = queryset.filter(field_5018__pk=adm2_id)
        if adm3_id: queryset = queryset.filter(field_5019__pk=adm3_id)
        if adm4_id: queryset = queryset.filter(field_5020__pk=adm4_id)
        queryset = queryset.annotate(
            area_in_acres=ExpressionWrapper(
                Cast('field_5021', output_field=FloatField()) * Case(
                    When(field_5022__id=2, then=Value(2.47105)),
                    When(field_5022__id=3, then=Value(1.0 / 4840)),
                    default=Value(1.0),
                    output_field=FloatField()
                ),
                output_field=FloatField()
            )
        )
        agg = queryset.aggregate(
            count=Count('id'),
            covered_area=Sum('area_in_acres')
        )
        return Response({"success": 1, "data": {
            "count": agg['count'] or 0,
            "covered_area": round(agg['covered_area'] or 0, 2),
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
        queryset = TblCoreFarm.objects.all()
        if search_for:
            queryset = queryset.filter(
                Q(field_5014__icontains=search_for)
                | Q(field_5015__icontains=search_for)
                | Q(field_5016__name__icontains=search_for)
                | Q(field_5017__name__icontains=search_for)
                | Q(field_5018__name__icontains=search_for)
                | Q(field_5019__name__icontains=search_for)
                | Q(field_5020__name__icontains=search_for)
                | Q(field_5021__icontains=search_for)
                | Q(field_5022__area_unit__icontains=search_for)
            )
        if adm0_id: queryset = queryset.filter(field_5016__pk=adm0_id)
        if adm1_id: queryset = queryset.filter(field_5017__pk=adm1_id)
        if adm2_id: queryset = queryset.filter(field_5018__pk=adm2_id)
        if adm3_id: queryset = queryset.filter(field_5019__pk=adm3_id)
        if adm4_id: queryset = queryset.filter(field_5020__pk=adm4_id)

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

            data = TblCoreFarmSerializer(page_obj.object_list, many=True).data
            return Response({
                "success": 1,
                "count": paginator.count,
                "next": page_obj.next_page_number() if page_obj.has_next() else None,
                "previous": page_obj.previous_page_number() if page_obj.has_previous() else None,
                "data": data
            }, status=200)
        else:
            data = TblCoreFarmSerializer(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)
