from django.db.models import Sum, F
from django.db.models.functions import TruncMonth
from api_core.models import TblCoreBuyer, TblCoreSupplier, TblExpSales, TblIncome


class DashboardStakeholderUtil:
    def __init__(self, **kwargs):
        self.adm0_id = kwargs.get('adm0_id')
        self.adm1_id = kwargs.get('adm1_id')
        self.adm2_id = kwargs.get('adm2_id')
        self.adm3_id = kwargs.get('adm3_id')
        self.adm4_id = kwargs.get('adm4_id')

    # ------------------------------------------------------------------ #
    #  Filter helpers
    # ------------------------------------------------------------------ #
    def _fs(self, qs):
        """Filter TblCoreSupplier by supplier's own location fields."""
        qs = qs.filter(status=True)
        if self.adm0_id: qs = qs.filter(field_5034__pk=self.adm0_id)
        if self.adm1_id: qs = qs.filter(field_5035__pk=self.adm1_id)
        if self.adm2_id: qs = qs.filter(field_5036__pk=self.adm2_id)
        if self.adm3_id: qs = qs.filter(field_5037__pk=self.adm3_id)
        if self.adm4_id: qs = qs.filter(field_5038__pk=self.adm4_id)
        return qs

    def _fb(self, qs):
        """Filter TblCoreBuyer by buyer's own location fields."""
        qs = qs.filter(status=True)
        if self.adm0_id: qs = qs.filter(field_5043__pk=self.adm0_id)
        if self.adm1_id: qs = qs.filter(field_5044__pk=self.adm1_id)
        if self.adm2_id: qs = qs.filter(field_5045__pk=self.adm2_id)
        if self.adm3_id: qs = qs.filter(field_5046__pk=self.adm3_id)
        if self.adm4_id: qs = qs.filter(field_5047__pk=self.adm4_id)
        return qs

    def _fe(self, qs):
        """Filter TblExpSales / TblIncome by farm location."""
        qs = qs.filter(status=True)
        if self.adm0_id: qs = qs.filter(farm__field_5016__pk=self.adm0_id)
        if self.adm1_id: qs = qs.filter(farm__field_5017__pk=self.adm1_id)
        if self.adm2_id: qs = qs.filter(farm__field_5018__pk=self.adm2_id)
        if self.adm3_id: qs = qs.filter(farm__field_5019__pk=self.adm3_id)
        if self.adm4_id: qs = qs.filter(farm__field_5020__pk=self.adm4_id)
        return qs

    # ------------------------------------------------------------------ #
    #  Main execute
    # ------------------------------------------------------------------ #
    def execute(self):
        r = lambda v: round(v or 0, 2)

        # ---- 1. Supplier numbers ----
        total_suppliers  = self._fs(TblCoreSupplier.objects.all()).count()

        sales_qs         = self._fe(TblExpSales.objects.all())
        active_suppliers = sales_qs.filter(supplier__isnull=False).values('supplier').distinct().count()
        total_sup_txns   = sales_qs.filter(supplier__isnull=False).count()
        supplier_vol     = r(sales_qs.aggregate(total=Sum(F('field_5058') * F('field_5059')))['total'])

        # ---- 2. Buyer numbers ----
        total_buyers   = self._fb(TblCoreBuyer.objects.all()).count()

        income_qs      = self._fe(TblIncome.objects.all())
        active_buyers  = income_qs.filter(buyer__isnull=False).values('buyer').distinct().count()
        total_buy_txns = income_qs.filter(buyer__isnull=False).count()
        buyer_vol      = r(income_qs.aggregate(total=Sum(F('field_5157') * F('field_5158')))['total'])

        # ---- 3. Top 5 buyers by transaction volume ----
        top_buyers = [
            {'buyer': row['buyer__field_5049'] or 'Unknown', 'volume': r(row['total'])}
            for row in (
                income_qs
                .filter(buyer__isnull=False)
                .values('buyer__field_5049')
                .annotate(total=Sum(F('field_5157') * F('field_5158')))
                .order_by('-total')[:5]
            )
        ]

        # ---- 4. Top 5 suppliers by transaction volume ----
        top_suppliers = [
            {'supplier': row['supplier__field_5040'] or 'Unknown', 'volume': r(row['total'])}
            for row in (
                sales_qs
                .filter(supplier__isnull=False)
                .values('supplier__field_5040')
                .annotate(total=Sum(F('field_5058') * F('field_5059')))
                .order_by('-total')[:5]
            )
        ]

        # ---- 5. Monthly transaction volume trend — buyers (TblIncome.created_on) ----
        buyer_monthly = sorted(
            [
                {'month': row['month'].strftime('%Y-%m'), 'volume': r(row['total'])}
                for row in (
                    income_qs
                    .annotate(month=TruncMonth('created_on'))
                    .values('month')
                    .annotate(total=Sum(F('field_5157') * F('field_5158')))
                    .filter(month__isnull=False)
                )
            ],
            key=lambda x: x['month'],
        )

        # ---- 6. Monthly transaction volume trend — suppliers (TblExpSales.created_on) ----
        supplier_monthly = sorted(
            [
                {'month': row['month'].strftime('%Y-%m'), 'volume': r(row['total'])}
                for row in (
                    sales_qs
                    .annotate(month=TruncMonth('created_on'))
                    .values('month')
                    .annotate(total=Sum(F('field_5058') * F('field_5059')))
                    .filter(month__isnull=False)
                )
            ],
            key=lambda x: x['month'],
        )

        return {
            # Supplier KPIs
            'total_suppliers':           total_suppliers,
            'active_suppliers':          active_suppliers,
            'supplier_total_txns':       total_sup_txns,
            'supplier_txn_volume':       supplier_vol,
            # Buyer KPIs
            'total_buyers':              total_buyers,
            'active_buyers':             active_buyers,
            'buyer_total_txns':          total_buy_txns,
            'buyer_txn_volume':          buyer_vol,
            # Comparison: total expense (supplier side) vs total income (buyer side)
            'total_expense_volume':      supplier_vol,
            'total_income_volume':       buyer_vol,
            # Graphs
            'top_5_buyers_by_volume':    top_buyers,
            'top_5_suppliers_by_volume': top_suppliers,
            'buyer_monthly_trend':       buyer_monthly,
            'supplier_monthly_trend':    supplier_monthly,
        }
