from dairy_profitability_api.settings import env
import pymysql


class RawSQL:
    def __init__(self):
        pass

    def _get_connection(self):
        """Return a new pymysql connection."""
        return pymysql.connect(
            host=env.get("DB_HOST"),
            user=env.get("DB_USER"),
            password=env.get("DB_PASS"),
            database=env.get("DB_NAME"),
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )

    def list_tables(self, purpose=None):
        lookups = [
            "lkp_adm0",
            "lkp_adm1",
            "lkp_adm2",
            "lkp_adm3",
            "lkp_adm4",
            "lkp_adm_hierarchy",
            "lkp_animal_type",
            "lkp_breed_matrix",
            "lkp_calf_feed_type",
            "lkp_cost_category",
            "lkp_feed_type",
            "lkp_forage_combination",
            "lkp_forage_ratio",
            "lkp_health_event_type",
            "lkp_milk_channel",
            "lkp_sale_type",
            "tbl_form",
            "tbl_form_field",
            "tbl_form_field_option",
            "tbl_form_type",
        ]

        core = [
            "tbl_core_animal",
            "tbl_core_coop_group",
            "tbl_core_farm",
            "tbl_core_herd",
        ]

        activity = [
            "tbl_animal_measurement",
            "tbl_breeding_costs",
            "tbl_calf_feeding_plan",
            "tbl_calf_feeding_weekly",
            "tbl_concentrate_guide",
            "tbl_farm_visit",
            "tbl_feed_inputs",
            "tbl_forage_preference",
            "tbl_gap_analysis",
            "tbl_herd_health_costs",
            "tbl_herd_structure",
            "tbl_labour_costs",
            "tbl_milk_channel_price",
            "tbl_milk_production",
            "tbl_operational_costs",
            "tbl_profitability_line_items",
            "tbl_profitability_snapshot",
            "tbl_recommendations",
            "tbl_reproductive_params",
            "tbl_revenue_items",
            "tbl_system_assumptions",
        ]

        if purpose == "lookups":
            return lookups
        elif purpose == "core":
            return core
        elif purpose == "activity":
            return activity
        else:
            return lookups + core + activity


    def get_table_defs(self, purpose=None, include_fk=False):
        conn = self._get_connection()
        try:
            tables = self.list_tables(purpose=purpose)
            table_defs = {}
            for table in tables:
                with conn.cursor() as cursor:
                    # Initially only columns
                    cursor.execute(f"""
                        SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY, EXTRA
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = '{env.get("DB_NAME")}' AND TABLE_NAME = '{table}';
                    """)
                    columns = cursor.fetchall()
                    col_defs = []
                    for col in columns:
                        col_name = col["COLUMN_NAME"]
                        col_type = col["COLUMN_TYPE"].upper().split("(")[0]  # remove lengths
                        nullable = "NULL" if col["IS_NULLABLE"] == "YES" else "NOT NULL"
                        default = f"DEFAULT {col['COLUMN_DEFAULT']}" if col["COLUMN_DEFAULT"] is not None else ""
                        key = "PRIMARY KEY" if col["COLUMN_KEY"] == "PRI" else ""
                        extra = col["EXTRA"].upper()
                        parts = " ".join(filter(None, [col_name, col_type, key, extra, nullable, default]))
                        col_defs.append(parts)
                    # Foreign keys if table has referencing columns
                    if include_fk:
                        cursor.execute(f"""
                            SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                            WHERE TABLE_SCHEMA = '{env.get("DB_NAME")}'
                              AND TABLE_NAME = '{table}'
                              AND REFERENCED_TABLE_NAME IS NOT NULL;
                        """)
                        fks = cursor.fetchall()
                        for fk in fks:
                            col_defs.append(f"FOREIGN KEY ({fk['COLUMN_NAME']}) REFERENCES {fk['REFERENCED_TABLE_NAME']}({fk['REFERENCED_COLUMN_NAME']})")
                    table_defs[table] = f"({', '.join(col_defs)})"
            return table_defs
        finally:
            conn.close()
