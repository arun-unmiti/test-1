# api_web/views/location_stats.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

from api_location.models import LkpCountry, LkpLocation
from api_auth.models import TblUser, TblUserLocation
from api_core.models.farm_registration import TblCoreFarm
from api_web.utils import decode_token


def _token_error(exc):
    if isinstance(exc, ExpiredSignatureError):
        return Response({"success": 0, "message": "Token expired, please login again", "session_expired": True}, status=401)
    return Response({"success": 0, "message": "Invalid token, please login again", "session_expired": True}, status=401)


def _descendant_ids(loc):
    """Return list of lkp_location IDs for this location and all its descendants."""
    ids = [loc.pk]
    if loc.path:
        child_ids = list(
            LkpLocation.objects.filter(path__startswith=loc.path + '/', status=True)
            .values_list('id', flat=True)
        )
        ids.extend(child_ids)
    return ids


class LocationStatsView(APIView):
    """
    GET /web/location_stats
        Returns location hierarchy data with farm and user counts for all levels.
        Response: { success:1, data: { country:[...], level1:[...], level2:[...], level3:[...] } }
    """

    def get(self, request):
        token = request.headers.get("Authorization")
        try:
            decode_token(token)

            # ── Country level ─────────────────────────────────────────────────
            countries = LkpCountry.objects.filter(is_active=True).order_by('name')
            country_data = []
            for c in countries:
                active_users = TblUser.objects.filter(adm0_id=c.pk, status=True).count()
                loc_ids = list(LkpLocation.objects.filter(adm0_id=c.pk, status=True).values_list('id', flat=True))
                farm_count = TblCoreFarm.objects.filter(adm0_id__in=loc_ids, status=1).count() if loc_ids else 0
                country_data.append({
                    'id': c.pk,
                    'code': c.iso_code_2 or '',
                    'name': c.name,
                    'total_farms': farm_count,
                    'active_users': active_users,
                    'status': 'active' if c.is_active else 'inactive',
                })

            # ── Level 1 ───────────────────────────────────────────────────────
            level1_qs = LkpLocation.objects.filter(level=1, status=True).select_related('adm0', 'parent').order_by('name')
            level1_data = []
            for loc in level1_qs:
                desc_ids = _descendant_ids(loc)
                active_users = TblUserLocation.objects.filter(status=True, location_id__in=desc_ids).values('user_id').distinct().count()
                farm_count = TblCoreFarm.objects.filter(adm0_id__in=desc_ids, status=1).count()
                level1_data.append({
                    'id': loc.pk,
                    'name': loc.name,
                    'country_name': loc.adm0.name if loc.adm0 else None,
                    'country_id': loc.adm0_id,
                    'total_farms': farm_count,
                    'active_users': active_users,
                    'status': 'active',
                })

            # ── Level 2 ───────────────────────────────────────────────────────
            level2_qs = LkpLocation.objects.filter(level=2, status=True).select_related('adm0', 'parent').order_by('name')
            level2_data = []
            for loc in level2_qs:
                desc_ids = _descendant_ids(loc)
                active_users = TblUserLocation.objects.filter(status=True, location_id__in=desc_ids).values('user_id').distinct().count()
                farm_count = TblCoreFarm.objects.filter(adm0_id__in=desc_ids, status=1).count()
                level2_data.append({
                    'id': loc.pk,
                    'name': loc.name,
                    'parent_name': loc.parent.name if loc.parent else None,
                    'country_name': loc.adm0.name if loc.adm0 else None,
                    'total_farms': farm_count,
                    'active_users': active_users,
                    'status': 'active',
                })

            # ── Level 3 ───────────────────────────────────────────────────────
            level3_qs = LkpLocation.objects.filter(level=3, status=True).select_related('adm0', 'parent').order_by('name')
            level3_data = []
            for loc in level3_qs:
                desc_ids = _descendant_ids(loc)
                active_users = TblUserLocation.objects.filter(status=True, location_id__in=desc_ids).values('user_id').distinct().count()
                farm_count = TblCoreFarm.objects.filter(adm0_id__in=desc_ids, status=1).count()
                level3_data.append({
                    'id': loc.pk,
                    'name': loc.name,
                    'parent_name': loc.parent.name if loc.parent else None,
                    'country_name': loc.adm0.name if loc.adm0 else None,
                    'total_farms': farm_count,
                    'active_users': active_users,
                    'status': 'active',
                })

            return Response({
                "success": 1,
                "data": {
                    "country": country_data,
                    "level1": level1_data,
                    "level2": level2_data,
                    "level3": level3_data,
                }
            }, status=200)

        except (ExpiredSignatureError, InvalidTokenError) as e:
            return _token_error(e)
        except Exception as e:
            return Response({"success": 0, "message": "Server error - GET /web/location_stats", "desc": str(e)}, status=500)
