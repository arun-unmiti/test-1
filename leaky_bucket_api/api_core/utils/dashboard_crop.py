from django.db.models import Sum, F
from django.db.models.functions import TruncMonth
from api_core.models import (
    TblCoreCrop, LkpCropCycle,
    TblExpConstruction, TblExpCropMgmt, TblExpFieldClearing, TblExpHarvest,
    TblExpIrrigation, TblExpPbs, TblExpPdc, TblExpPlanting, TblExpProcessing,
    TblExpSales, TblExpSeeds, TblExpSoilPrep, TblExpStorage, TblExpTillage, TblExpWeedMgmt,
    TblIncome,
)
from api_core.utils.dashboard_overview import EXP_REGISTRY, _amt_expr


class DashboardCropUtil:
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

        # ---- 1. Active crops ----
        active_crops = self._fc(TblCoreCrop.objects.all()).values('field_5027').distinct().count()

        # ---- 2. Total income ----
        income_qs    = self._fe(TblIncome.objects.all())
        total_income = r(income_qs.aggregate(total=Sum(F('field_5157') * F('field_5158')))['total'])

        # ---- 3. Crop cycle stage labels (positional: LkpCropCycle[i] → EXP_REGISTRY[i]) ----
        cycle_labels = list(LkpCropCycle.objects.order_by('id').values_list('activity', flat=True))

        # ---- 4. EXP loop — per-crop, per-(crop,stage), per-(month,crop) expenses ----
        total_expenses     = 0.0
        crop_expenses      = {}   # crop_name → float
        crop_stage_expense = {}   # (crop_name, stage) → float
        month_crop_expense = {}   # (month_str, crop_name) → float

        for idx, (model, label, qty_f, price_f) in enumerate(EXP_REGISTRY):
            stage = cycle_labels[idx] if idx < len(cycle_labels) else label
            qs    = self._fe(model.objects.all())
            expr  = _amt_expr(qty_f, price_f)

            total_expenses += r(qs.aggregate(total=expr)['total'])

            # per-crop and per-(crop, stage) — single query
            for row in qs.values('crop__field_5027__crop_name').annotate(total=expr):
                cname = row['crop__field_5027__crop_name']
                if not cname:
                    continue
                amt = row['total'] or 0
                crop_expenses[cname]    = r(crop_expenses.get(cname, 0) + amt)
                key = (cname, stage)
                crop_stage_expense[key] = r(crop_stage_expense.get(key, 0) + amt)

            # per-(month, crop) — month from the linked crop's created_on
            for row in (
                qs.filter(crop__isnull=False)
                .annotate(month=TruncMonth('crop__created_on'))
                .values('month', 'crop__field_5027__crop_name')
                .annotate(total=expr)
            ):
                month = row['month']
                cname = row['crop__field_5027__crop_name']
                if not month or not cname:
                    continue
                mkey = (month.strftime('%Y-%m'), cname)
                month_crop_expense[mkey] = r(month_crop_expense.get(mkey, 0) + (row['total'] or 0))

        total_expenses = r(total_expenses)

        # ---- 5. Net profit / loss ----
        net = r(total_income - total_expenses)
        net_result = {'type': 'profit' if net >= 0 else 'loss', 'amount': abs(net)}

        # ---- 6. Per-crop income + per-(month, crop) income ----
        crop_income       = {}
        month_crop_income = {}

        for row in (
            income_qs
            .values('crop__field_5027__crop_name')
            .annotate(inc=Sum(F('field_5157') * F('field_5158')))
        ):
            cname = row['crop__field_5027__crop_name']
            if cname:
                crop_income[cname] = r(row['inc'])

        for row in (
            income_qs.filter(crop__isnull=False)
            .annotate(month=TruncMonth('crop__created_on'))
            .values('month', 'crop__field_5027__crop_name')
            .annotate(inc=Sum(F('field_5157') * F('field_5158')))
        ):
            month = row['month']
            cname = row['crop__field_5027__crop_name']
            if month and cname:
                month_crop_income[(month.strftime('%Y-%m'), cname)] = r(row['inc'])

        # ---- 7. Per-crop P&L ----
        all_crop_names = set(crop_income) | set(crop_expenses)
        crop_pnl = {
            cname: r(crop_income.get(cname, 0) - crop_expenses.get(cname, 0))
            for cname in all_crop_names
        }

        # ---- 8. Profitable / loss-making crops ----
        profitable_crops = sorted(
            [{'crop': c, 'profit': v}    for c, v in crop_pnl.items() if v > 0],
            key=lambda x: x['profit'], reverse=True,
        )
        loss_crops = sorted(
            [{'crop': c, 'loss': abs(v)} for c, v in crop_pnl.items() if v < 0],
            key=lambda x: x['loss'],    reverse=True,
        )

        # ---- 9. Monthly Revenue & Expense Trend ----
        all_month_crop_keys = set(month_crop_income) | set(month_crop_expense)
        monthly_trend = sorted(
            [
                {
                    'month':   mk,
                    'crop':    ck,
                    'income':  month_crop_income.get((mk, ck), 0),
                    'expense': month_crop_expense.get((mk, ck), 0),
                }
                for mk, ck in all_month_crop_keys
            ],
            key=lambda x: (x['month'], x['crop']),
        )

        # ---- 10. Pie charts: income / expense / net by crop ----
        sorted_crops    = sorted(all_crop_names)
        income_by_crop  = [{'crop': c, 'income':  crop_income.get(c, 0)}   for c in sorted_crops]
        expense_by_crop = [{'crop': c, 'expense': crop_expenses.get(c, 0)} for c in sorted_crops]
        net_by_crop     = [
            {'crop': c, 'net': crop_pnl[c], 'type': 'profit' if crop_pnl[c] >= 0 else 'loss'}
            for c in sorted_crops
        ]

        # ---- 11. Expense by crop cycle stage ----
        expense_by_stage = sorted(
            [
                {'stage': stage, 'crop': cname, 'expense': amt}
                for (cname, stage), amt in crop_stage_expense.items()
            ],
            key=lambda x: (x['stage'], x['crop']),
        )

        # ---- 12. Profit margin analysis by crop ----
        profit_margin_by_crop = sorted(
            [
                {
                    'crop':       cname,
                    'income':     crop_income.get(cname, 0),
                    'expense':    crop_expenses.get(cname, 0),
                    'margin_pct': (
                        r((crop_income.get(cname, 0) - crop_expenses.get(cname, 0))
                          / crop_expenses[cname] * 100)
                        if crop_expenses.get(cname, 0) > 0 else None
                    ),
                }
                for cname in all_crop_names
            ],
            key=lambda x: (x['margin_pct'] or 0), reverse=True,
        )

        # ---- 13. Seasonal Crop Calendar Heatmap ----
        # Income per (crop, stage): TblIncome.field_5060 is a direct FK to LkpCropCycle
        stage_income = {}
        for row in (
            income_qs
            .filter(field_5060__isnull=False)
            .values('crop__field_5027__crop_name', 'field_5060__activity')
            .annotate(inc=Sum(F('field_5157') * F('field_5158')))
        ):
            cname = row['crop__field_5027__crop_name']
            stage = row['field_5060__activity']
            if cname and stage:
                stage_income[(cname, stage)] = r(row['inc'])

        all_heatmap_keys = set(crop_stage_expense) | set(stage_income)
        seasonal_heatmap = sorted(
            [
                {
                    'crop':        cname,
                    'stage':       stage,
                    'expense':     crop_stage_expense.get((cname, stage), 0),
                    'income':      stage_income.get((cname, stage), 0),
                    'net_expense': r(
                        crop_stage_expense.get((cname, stage), 0)
                        - stage_income.get((cname, stage), 0)
                    ),
                }
                for cname, stage in all_heatmap_keys
            ],
            key=lambda x: (x['crop'], x['stage']),
        )

        return {
            'active_crops':          active_crops,
            'total_income':          total_income,
            'total_expenses':        total_expenses,
            'net_profit_loss':       net_result,
            'profitable_crops':      profitable_crops,
            'loss_crops':            loss_crops,
            'monthly_trend':         monthly_trend,
            'income_by_crop':        income_by_crop,
            'expense_by_crop':       expense_by_crop,
            'net_by_crop':           net_by_crop,
            'expense_by_stage':      expense_by_stage,
            'profit_margin_by_crop': profit_margin_by_crop,
            'seasonal_heatmap':      seasonal_heatmap,
        }
