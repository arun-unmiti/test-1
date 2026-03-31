from django.db.models import Sum, Count, F, Case, When, Value, FloatField, ExpressionWrapper
from django.db.models.functions import Cast
from api_core.models import (
    TblCoreFarmer, TblCoreFarm, TblCoreCrop,
    TblExpConstruction, TblExpCropMgmt, TblExpFieldClearing, TblExpHarvest,
    TblExpIrrigation, TblExpPbs, TblExpPdc, TblExpPlanting, TblExpProcessing,
    TblExpSales, TblExpSeeds, TblExpSoilPrep, TblExpStorage, TblExpTillage, TblExpWeedMgmt,
    TblIncome,
)


# Registry: (model, display_label, qty_field, price_field_or_None)
# If price_field is None → Sum(qty_field); else → Sum(F(qty) * F(price))
EXP_REGISTRY = [
    (TblExpConstruction, 'Construction', 'field_5066', None),
    (TblExpSeeds, 'Seeds', 'field_5071', None),
    (TblExpFieldClearing, 'Field Clearing', 'field_5076', None),
    (TblExpTillage, 'Tillage', 'field_5082', None),
    (TblExpSoilPrep, 'Fertilization - Soil preparation', 'field_5090', 'field_5091'),
    (TblExpPlanting, 'Planting', 'field_5097', None),
    (TblExpIrrigation, 'Irrigation', 'field_5108', None),
    (TblExpCropMgmt, 'Crop Management', 'field_5113', 'field_5114'),
    (TblExpPdc, 'Pests & Disease Control', 'field_5120', None),
    (TblExpWeedMgmt, 'Weed Management', 'field_5126', None),
    (TblExpHarvest, 'Harvest', 'field_5132', None),
    (TblExpPbs, 'Processing before Storage', 'field_5138', None),
    (TblExpStorage, 'Storage', 'field_5144', None),
    (TblExpProcessing, 'Processing', 'field_5150', None),
    (TblExpSales, 'Market & Sales', 'field_5058', 'field_5059'),
]


def _amt_expr(qty_f, price_f):
    """Return the Django aggregate expression for an expense amount."""
    if price_f:
        return Sum(F(qty_f) * F(price_f))
    return Sum(qty_f)


class DashboardOverviewUtil():
    def __init__(self, **kwargs):
        self.adm0_id = kwargs.get('adm0_id')
        self.adm1_id = kwargs.get('adm1_id')
        self.adm2_id = kwargs.get('adm2_id')
        self.adm3_id = kwargs.get('adm3_id')
        self.adm4_id = kwargs.get('adm4_id')
        self.crop_id = kwargs.get('crop_id')

    # ------------------------------------------------------------------ #
    #  Filter helpers
    # ------------------------------------------------------------------ #
    def _ff(self, qs):
        qs = qs.filter(status=True)
        if self.adm0_id: qs = qs.filter(field_5007__pk=self.adm0_id)
        if self.adm1_id: qs = qs.filter(field_5008__pk=self.adm1_id)
        if self.adm2_id: qs = qs.filter(field_5009__pk=self.adm2_id)
        if self.adm3_id: qs = qs.filter(field_5010__pk=self.adm3_id)
        if self.adm4_id: qs = qs.filter(field_5011__pk=self.adm4_id)
        return qs

    def _fm(self, qs):
        qs = qs.filter(status=True)
        if self.adm0_id: qs = qs.filter(field_5016__pk=self.adm0_id)
        if self.adm1_id: qs = qs.filter(field_5017__pk=self.adm1_id)
        if self.adm2_id: qs = qs.filter(field_5018__pk=self.adm2_id)
        if self.adm3_id: qs = qs.filter(field_5019__pk=self.adm3_id)
        if self.adm4_id: qs = qs.filter(field_5020__pk=self.adm4_id)
        return qs

    def _fc(self, qs):
        qs = qs.filter(status=True)
        if self.adm0_id: qs = qs.filter(farm__field_5016__pk=self.adm0_id)
        if self.adm1_id: qs = qs.filter(farm__field_5017__pk=self.adm1_id)
        if self.adm2_id: qs = qs.filter(farm__field_5018__pk=self.adm2_id)
        if self.adm3_id: qs = qs.filter(farm__field_5019__pk=self.adm3_id)
        if self.adm4_id: qs = qs.filter(farm__field_5020__pk=self.adm4_id)
        if self.crop_id: qs = qs.filter(field_5027__pk__in=self.crop_id)
        return qs

    def _fe(self, qs):
        qs = qs.filter(status=True)
        if self.adm0_id: qs = qs.filter(farm__field_5016__pk=self.adm0_id)
        if self.adm1_id: qs = qs.filter(farm__field_5017__pk=self.adm1_id)
        if self.adm2_id: qs = qs.filter(farm__field_5018__pk=self.adm2_id)
        if self.adm3_id: qs = qs.filter(farm__field_5019__pk=self.adm3_id)
        if self.adm4_id: qs = qs.filter(farm__field_5020__pk=self.adm4_id)
        if self.crop_id: qs = qs.filter(crop__field_5027__pk__in=self.crop_id)
        return qs

    # ------------------------------------------------------------------ #
    #  Main execute
    # ------------------------------------------------------------------ #
    def execute(self):
        r = lambda v: round(v or 0, 2)

        # ---- 1. Core counts + area totals ----
        total_farmers          = self._ff(TblCoreFarmer.objects.all()).count()
        total_farms            = self._fm(TblCoreFarm.objects.all()).count()
        total_crops_registered = self._fc(TblCoreCrop.objects.all()).count()

        farm_qs = self._fm(TblCoreFarm.objects.all()).annotate(
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
        covered_area = r(farm_qs.aggregate(total=Sum('area_in_acres'))['total'])

        crop_qs = self._fc(TblCoreCrop.objects.all()).annotate(
            area_in_acres=ExpressionWrapper(
                Cast('field_5028', output_field=FloatField()) * Case(
                    When(field_5029__id=2, then=Value(2.47105)),
                    When(field_5029__id=3, then=Value(1.0 / 4840)),
                    default=Value(1.0),
                    output_field=FloatField()
                ),
                output_field=FloatField()
            )
        )
        crop_area = r(crop_qs.aggregate(total=Sum('area_in_acres'))['total'])

        # ---- 2. Total income ----
        income_qs    = self._fe(TblIncome.objects.all())
        total_income = r(income_qs.aggregate(total=Sum(F('field_5157') * F('field_5158')))['total'])

        # ---- 3. Expenses: totals + per-crop + per-farmer rollup ----
        total_expenses  = 0.0
        expense_sources = []
        crop_expenses   = {}   # lkp_crop_id → {'name': str, 'expense': float}
        farmer_expenses = {}   # farmer_id    → float

        for model, label, qty_f, price_f in EXP_REGISTRY:
            qs   = self._fe(model.objects.all())
            expr = _amt_expr(qty_f, price_f)

            # overall total (single aggregate call)
            total_val = r(qs.aggregate(total=expr)['total'])
            total_expenses += total_val
            expense_sources.append({'source': label, 'amount': total_val})

            # per-crop totals
            for row in qs.values('crop__field_5027__pk', 'crop__field_5027__crop_name').annotate(total=expr):
                cid = row['crop__field_5027__pk']
                if not cid:
                    continue
                if cid not in crop_expenses:
                    crop_expenses[cid] = {'name': row['crop__field_5027__crop_name'], 'expense': 0.0}
                crop_expenses[cid]['expense'] = r(crop_expenses[cid]['expense'] + (row['total'] or 0))

            # per-farmer totals (income/expenses linked via farm → farmer)
            for row in qs.values('farm__farmer__id').annotate(total=expr):
                fid = row['farm__farmer__id']
                if fid:
                    farmer_expenses[fid] = r(farmer_expenses.get(fid, 0) + (row['total'] or 0))

        total_expenses = r(total_expenses)

        # ---- 4. Net profit / loss ----
        net = r(total_income - total_expenses)
        net_result = {'type': 'profit' if net >= 0 else 'loss', 'amount': abs(net)}

        # ---- 5. Per-crop income ----
        crop_income = {}
        for row in (
            income_qs
            .values('crop__field_5027__pk', 'crop__field_5027__crop_name')
            .annotate(inc=Sum(F('field_5157') * F('field_5158')))
        ):
            cid = row['crop__field_5027__pk']
            if cid:
                crop_income[cid] = {'name': row['crop__field_5027__crop_name'], 'income': r(row['inc'])}

        # ---- Active crops: present in at least one TblExp* or TblIncome record ----
        active_crops = len(set(crop_income) | set(crop_expenses))

        # ---- 6. Top 5 profit / loss crops ----
        all_crop_ids = set(crop_income) | set(crop_expenses)
        crop_pnl = sorted(
            [
                {
                    'crop': crop_income.get(cid, crop_expenses.get(cid, {})).get('name', 'Unknown'),
                    'pnl':  r(crop_income.get(cid, {}).get('income', 0) - crop_expenses.get(cid, {}).get('expense', 0)),
                }
                for cid in all_crop_ids
            ],
            key=lambda x: x['pnl'],
            reverse=True,
        )
        top5_profit = [{'crop': x['crop'], 'profit': x['pnl']}    for x in crop_pnl              if x['pnl'] > 0][:5]
        top5_loss   = [{'crop': x['crop'], 'loss':   abs(x['pnl'])} for x in reversed(crop_pnl) if x['pnl'] < 0][:5]

        # ---- 7. Per-farmer income + avg profit/loss ----
        farmer_income = {}
        for row in (
            income_qs
            .values('farm__farmer__id')
            .annotate(inc=Sum(F('field_5157') * F('field_5158')))
        ):
            fid = row['farm__farmer__id']
            if fid:
                farmer_income[fid] = r(row['inc'])

        # ---- Active farmers: present in at least one TblExp* or TblIncome record ----
        active_farmers = len(set(farmer_income) | set(farmer_expenses))

        all_farmer_ids = set(farmer_income) | set(farmer_expenses)
        farmer_pnl = {
            fid: r(farmer_income.get(fid, 0) - farmer_expenses.get(fid, 0))
            for fid in all_farmer_ids
        }
        if farmer_pnl:
            avg_pnl   = r(sum(farmer_pnl.values()) / len(farmer_pnl))
            above_avg = sum(1 for v in farmer_pnl.values() if v > avg_pnl)
            below_avg = sum(1 for v in farmer_pnl.values() if v <= avg_pnl)
        else:
            avg_pnl, above_avg, below_avg = 0, 0, 0

        avg_farmer_pnl = {
            'average':            avg_pnl,
            'type':               'profit' if avg_pnl >= 0 else 'loss',
            'farmers_above_avg':  above_avg,
            'farmers_below_avg':  below_avg,
        }

        # ---- 8. Most used farm inputs (fertilizers via TblExpCropMgmt) ----
        farm_inputs = [
            {
                'input':   row['field_5112'] or 'Unknown',
                'count':   row['count'],
                'expense': r(row['expense']),
            }
            for row in (
                self._fe(TblExpCropMgmt.objects.all())
                .values('field_5112')
                .annotate(count=Count('id'), expense=Sum(F('field_5113') * F('field_5114')))
                .order_by('-count')
            )
        ]

        # ---- 9. Income sources (buyer type via field_5154) ----
        income_sources = [
            {
                'source':       row['field_5154__label'] or 'Unknown',
                'count':        row['count'],
                'total_amount': r(row['total_amount']),
            }
            for row in (
                income_qs
                .values('field_5154__label')
                .annotate(count=Count('id'), total_amount=Sum(F('field_5157') * F('field_5158')))
                .order_by('-count')
            )
        ]

        # ---- 10. Expense sources (already built, sort by amount desc) ----
        expense_sources.sort(key=lambda x: x['amount'], reverse=True)

        return {
            'total_farmers':          total_farmers,
            'total_farms':            total_farms,
            'total_crops_registered': total_crops_registered,
            'active_farmers':         active_farmers,
            'covered_area':           covered_area,
            'active_crops':           active_crops,
            'crop_area':              crop_area,
            'total_income':           total_income,
            'total_expenses':         total_expenses,
            'net_profit_loss':        net_result,
            'top5_profit_crops':      top5_profit,
            'top5_loss_crops':        top5_loss,
            'avg_farmer_profit_loss': avg_farmer_pnl,
            'farm_inputs':            farm_inputs,
            'income_sources':         income_sources,
            'expense_sources':        expense_sources,
        }
