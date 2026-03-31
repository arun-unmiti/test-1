from ..models import TblCoreSupplier
from ..serializers import TblCoreSupplierSerializer
from rest_framework.response import Response
from django.db.models import Q, Count
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class UtilCoreSupplier:
    def read_single(self, **kwargs):
        item_id = kwargs.get("id")
        data_id = kwargs.get("data_id")
        if item_id:
            queryobj = TblCoreSupplier.objects.filter(pk=item_id).first()
        elif data_id:
            queryobj = TblCoreSupplier.objects.filter(data_id=data_id).first()
        else:
            queryobj = None
        if not queryobj:
            return Response({"success": 0, "message": "The requested record is not found under supplier registration"}, status=404)
        data = TblCoreSupplierSerializer(queryobj, many=False).data
        return Response({"success": 1, "data": data}, status=200)

    def read_summary(self, **kwargs):
        adm0_id = kwargs.get("adm0_id")
        adm1_id = kwargs.get("adm1_id")
        adm2_id = kwargs.get("adm2_id")
        adm3_id = kwargs.get("adm3_id")
        adm4_id = kwargs.get("adm4_id")
        queryset = TblCoreSupplier.objects.all()
        if adm0_id: queryset = queryset.filter(field_5034__pk=adm0_id)
        if adm1_id: queryset = queryset.filter(field_5035__pk=adm1_id)
        if adm2_id: queryset = queryset.filter(field_5036__pk=adm2_id)
        if adm3_id: queryset = queryset.filter(field_5037__pk=adm3_id)
        if adm4_id: queryset = queryset.filter(field_5038__pk=adm4_id)
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
        queryset = TblCoreSupplier.objects.all()
        if search_for:
            queryset = queryset.filter(
                Q(field_5034__name__icontains=search_for)
                | Q(field_5035__name__icontains=search_for)
                | Q(field_5036__name__icontains=search_for)
                | Q(field_5037__name__icontains=search_for)
                | Q(field_5038__name__icontains=search_for)
                | Q(field_5039__label__icontains=search_for)
                | Q(field_5040__icontains=search_for)
                | Q(field_5041__icontains=search_for)
                | Q(field_5042__icontains=search_for)
            )
        if adm0_id: queryset = queryset.filter(field_5034__pk=adm0_id)
        if adm1_id: queryset = queryset.filter(field_5035__pk=adm1_id)
        if adm2_id: queryset = queryset.filter(field_5036__pk=adm2_id)
        if adm3_id: queryset = queryset.filter(field_5037__pk=adm3_id)
        if adm4_id: queryset = queryset.filter(field_5038__pk=adm4_id)

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

            data = TblCoreSupplierSerializer(page_obj.object_list, many=True).data
            return Response({
                "success": 1,
                "count": paginator.count,
                "next": page_obj.next_page_number() if page_obj.has_next() else None,
                "previous": page_obj.previous_page_number() if page_obj.has_previous() else None,
                "data": data
            }, status=200)
        else:
            data = TblCoreSupplierSerializer(queryset, many=True).data
            return Response({"success": 1, "data": data}, status=200)
