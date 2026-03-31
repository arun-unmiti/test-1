from django.db.models import Sum, Count, F
from api_core.models import (
    TblCoreFarmer, TblCoreFarm, TblCoreCrop,
    TblExpConstruction, TblExpCropMgmt, TblExpFieldClearing, TblExpHarvest,
    TblExpIrrigation, TblExpPbs, TblExpPdc, TblExpPlanting, TblExpProcessing,
    TblExpSales, TblExpSeeds, TblExpSoilPrep, TblExpStorage, TblExpTillage, TblExpWeedMgmt,
    TblIncome,
)
from api_core.utils.dashboard_overview import EXP_REGISTRY, _amt_expr


# Performance buckets: (lower_bound_exclusive, upper_bound_inclusive, label)
PERF_BUCKETS = [
    (0,   10,  '1-10%'),
    (10,  25,  '10-25%'),
    (25,  50,  '25-50%'),
    (50,  75,  '50-75%'),
    (75,  100, '75-100%'),
    (100, None, '>100%'),
]


def _pct_bucket(pct):
    for _lo, hi, label in PERF_BUCKETS:
        if hi is None or pct <= hi:
            return label
    return '>100%'


class DashboardFarmerUtil:
    def __init__(self, **kwargs):
        self.adm0_id = kwargs.get('adm0_id')
        self.adm1_id = kwargs.get('adm1_id')
        self.adm2_id = kwargs.get('adm2_id')
        self.adm3_id = kwargs.get('adm3_id')
        self.adm4_id = kwargs.get('adm4_id')
        self.crop_id = kwargs.get('crop_id')

    # ------------------------------------------------------------------ #
    #  Filter helpers (mirrors DashboardOverviewUtil)
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

        # ---- 1. Common counts ----
        total_farmers = self._ff(TblCoreFarmer.objects.all()).count()
        total_farms   = self._fm(TblCoreFarm.objects.all()).count()
        active_crops  = self._fc(TblCoreCrop.objects.all()).values('field_5027').distinct().count()

        # ---- 2. Total income ----
        income_qs    = self._fe(TblIncome.objects.all())
        total_income = r(income_qs.aggregate(total=Sum(F('field_5157') * F('field_5158')))['total'])

        # ---- 3. Expenses: overall + per-farmer + per-region rollup ----
        total_expenses  = 0.0
        farmer_expenses = {}   # farmer_id → float
        region_expenses = {}   # adm0_id   → {'name': str, 'expense': float}

        for model, _label, qty_f, price_f in EXP_REGISTRY:
            qs   = self._fe(model.objects.all())
            expr = _amt_expr(qty_f, price_f)

            total_expenses += r(qs.aggregate(total=expr)['total'])

            for row in qs.values('farm__farmer__id').annotate(total=expr):
                fid = row['farm__farmer__id']
                if fid:
                    farmer_expenses[fid] = r(farmer_expenses.get(fid, 0) + (row['total'] or 0))

            for row in qs.values('farm__field_5017__id', 'farm__field_5017__name').annotate(total=expr):
                rid = row['farm__field_5017__id']
                if not rid:
                    continue
                if rid not in region_expenses:
                    region_expenses[rid] = {'name': row['farm__field_5017__name'], 'expense': 0.0}
                region_expenses[rid]['expense'] = r(region_expenses[rid]['expense'] + (row['total'] or 0))

        total_expenses = r(total_expenses)

        # ---- 4. Net profit / loss ----
        net = r(total_income - total_expenses)
        net_result = {'type': 'profit' if net >= 0 else 'loss', 'amount': abs(net)}

        # ---- 5. Per-farmer income ----
        farmer_income = {}
        for row in income_qs.values('farm__farmer__id').annotate(inc=Sum(F('field_5157') * F('field_5158'))):
            fid = row['farm__farmer__id']
            if fid:
                farmer_income[fid] = r(row['inc'])

        # ---- 6. Per-farmer P&L ----
        all_farmer_ids = set(farmer_income) | set(farmer_expenses)
        farmer_pnl = {
            fid: r(farmer_income.get(fid, 0) - farmer_expenses.get(fid, 0))
            for fid in all_farmer_ids
        }

        # ---- 7. Graph: Farmers by number of crops ----
        farmers_by_crops = [
            {'crop': row['field_5027__crop_name'], 'farmer_count': row['farmer_count']}
            for row in (
                self._fc(TblCoreCrop.objects.all())
                .values('field_5027__crop_name')
                .annotate(farmer_count=Count('farm__farmer', distinct=True))
                .order_by('-farmer_count')
            )
            if row['field_5027__crop_name']
        ]

        # ---- 8. Graph: Farmers by performance (profit/loss %) ----
        bucket_labels          = [label for *_, label in PERF_BUCKETS]
        profit_buckets         = {lbl: 0 for lbl in bucket_labels}
        loss_buckets           = {lbl: 0 for lbl in bucket_labels}

        for fid, pnl in farmer_pnl.items():
            if pnl == 0:
                continue
            expense = farmer_expenses.get(fid, 0)
            # pct relative to total expense; if expense=0 but income>0 → treat as >100%
            pct = (abs(pnl) / expense * 100) if expense > 0 else 101.0
            lbl = _pct_bucket(pct)
            if pnl > 0:
                profit_buckets[lbl] += 1
            else:
                loss_buckets[lbl] += 1

        farmers_by_performance_profit = [
            {'range': lbl, 'farmer_count': cnt} for lbl, cnt in profit_buckets.items()
        ]
        farmers_by_performance_loss = [
            {'range': lbl, 'farmer_count': cnt} for lbl, cnt in loss_buckets.items()
        ]

        # ---- 9. Graph: Income vs Expense by Region (LkpAdm0) ----
        region_income = {}
        for row in (
            income_qs
            .values('farm__field_5017__id', 'farm__field_5017__name')
            .annotate(inc=Sum(F('field_5157') * F('field_5158')))
        ):
            rid = row['farm__field_5017__id']
            if rid:
                region_income[rid] = {'name': row['farm__field_5017__name'], 'income': r(row['inc'])}

        all_region_ids = set(region_income) | set(region_expenses)
        income_vs_expense_by_region = sorted(
            [
                {
                    'region':  (region_income.get(rid) or region_expenses.get(rid, {})).get('name', 'Unknown'),
                    'income':  region_income.get(rid, {}).get('income', 0),
                    'expense': region_expenses.get(rid, {}).get('expense', 0),
                    'net':     r(
                        region_income.get(rid, {}).get('income', 0)
                        - region_expenses.get(rid, {}).get('expense', 0)
                    ),
                }
                for rid in all_region_ids
            ],
            key=lambda x: x['region'],
        )

        # ---- 10. Top 10 profit/loss farmers with metadata ----
        sorted_pnl       = sorted(farmer_pnl.items(), key=lambda x: x[1], reverse=True)
        top10_profit_ids = [fid for fid, pnl in sorted_pnl if pnl > 0][:10]
        top10_loss_ids   = [fid for fid, pnl in reversed(sorted_pnl) if pnl < 0][:10]

        farmer_meta = {
            row['id']: row
            for row in TblCoreFarmer.objects.filter(
                status=True,
                pk__in=list(set(top10_profit_ids + top10_loss_ids))
            ).values(
                'id', 'field_5002',
                'field_5007__name', 'field_5008__name', 'field_5009__name',
                'field_5010__name', 'field_5011__name',
            )
        }

        def _entry(fid, value_key, value):
            meta = farmer_meta.get(fid, {})
            return {
                'farmer':   meta.get('field_5002') or f'Farmer #{fid}',
                value_key:  value,
                'location': {k: v for k, v in {
                    'adm0': meta.get('field_5007__name'),
                    'adm1': meta.get('field_5008__name'),
                    'adm2': meta.get('field_5009__name'),
                    'adm3': meta.get('field_5010__name'),
                    'adm4': meta.get('field_5011__name'),
                }.items() if v},
            }

        top10_profitable_farmers = [_entry(fid, 'profit', r(pnl))       for fid, pnl in sorted_pnl          if pnl > 0][:10]
        top10_loss_farmers       = [_entry(fid, 'loss',   r(abs(pnl)))  for fid, pnl in reversed(sorted_pnl) if pnl < 0][:10]

        avg_income_per_farmer  = r(total_income  / total_farmers) if total_farmers else 0.0
        avg_expense_per_farmer = r(total_expenses / total_farmers) if total_farmers else 0.0

        return {
            'total_farmers':                 total_farmers,
            'total_farms':                   total_farms,
            'active_crops':                  active_crops,
            'total_income':                  total_income,
            'total_expenses':                total_expenses,
            'net_profit_loss':               net_result,
            'farmers_by_crops':              farmers_by_crops,
            'farmers_by_performance_profit': farmers_by_performance_profit,
            'farmers_by_performance_loss':   farmers_by_performance_loss,
            'income_vs_expense_by_region':   income_vs_expense_by_region,
            'top10_profitable_farmers':      top10_profitable_farmers,
            'top10_loss_farmers':            top10_loss_farmers,
            'avg_income_per_farmer':         avg_income_per_farmer,
            'avg_expense_per_farmer':        avg_expense_per_farmer,
        }
