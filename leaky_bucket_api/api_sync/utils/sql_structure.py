from leaky_bucket_api.settings import env
import pymysql


LOOKUP_TABLES = [
    "lkp_adm_hierarchy", "lkp_adm0", "lkp_adm1", "lkp_adm2", "lkp_adm3", "lkp_adm4",
    "lkp_crop_category", "lkp_crop_group", "lkp_crop_cycle", "lkp_crop_stage", "lkp_crop", "lkp_area_units",
    "tbl_form_type", "tbl_form", "tbl_form_field", "tbl_form_field_option",
]

CORE_TABLES = [
    "tbl_core_farmer", "tbl_core_farm", "tbl_core_crop",
    "tbl_core_supplier", "tbl_core_buyer", 
]

FINANCIAL_TABLES = [
    "tbl_income", "tbl_exp_construction", "tbl_exp_seeds", "tbl_exp_field_clearing", "tbl_exp_tillage",
    "tbl_exp_soil_prep", "tbl_exp_planting", "tbl_exp_duration", "tbl_exp_irrigation",
    "tbl_exp_crop_mgmt", "tbl_exp_pdc", "tbl_exp_weed_mgmt", "tbl_exp_harvest",
    "tbl_exp_pbs", "tbl_exp_storage", "tbl_exp_processing", "tbl_exp_sales",
]


class RawSQL:
    def __init__(self):
        self._CORE_RELATION_TABLES = {
            'tbl_core_farmer', 'tbl_core_farm', 'tbl_core_crop',
            'tbl_core_buyer', 'tbl_core_supplier',
        }


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
    

    def get_table_defs(self, tables, include_fk=False):
        conn = self._get_connection()
        try:
            table_defs = {}
            for table in tables:
                with conn.cursor() as cursor:
                    cursor.execute(f"""
                        SELECT COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
                        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                        WHERE TABLE_SCHEMA = '{env.get("DB_NAME")}'
                          AND TABLE_NAME = '{table}'
                          AND REFERENCED_TABLE_NAME IS NOT NULL;
                    """)
                    fk_rows = cursor.fetchall()
                    excluded_cols = {
                        row['COLUMN_NAME']
                        for row in fk_rows
                        if row['REFERENCED_TABLE_NAME'] in self._CORE_RELATION_TABLES
                    }
                    all_fks = {row['COLUMN_NAME']: row for row in fk_rows}

                    cursor.execute(f"""
                        SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY, EXTRA
                        FROM INFORMATION_SCHEMA.COLUMNS
                        WHERE TABLE_SCHEMA = '{env.get("DB_NAME")}' AND TABLE_NAME = '{table}'
                        ORDER BY ORDINAL_POSITION;
                    """)
                    columns = cursor.fetchall()
                    col_defs = []
                    for col in columns:
                        col_name = col["COLUMN_NAME"]
                        if col_name in excluded_cols:
                            continue
                        col_type = col["COLUMN_TYPE"].upper().split("(")[0]  # remove lengths
                        nullable = "NULL" if col["IS_NULLABLE"] == "YES" else "NOT NULL"
                        default = f"DEFAULT {col['COLUMN_DEFAULT']}" if col["COLUMN_DEFAULT"] is not None else ""
                        key = "PRIMARY KEY" if col["COLUMN_KEY"] == "PRI" else ""
                        extra = col["EXTRA"].upper()
                        parts = " ".join(filter(None, [col_name, col_type, key, extra, nullable, default]))
                        col_defs.append(parts)
                    if include_fk:
                        for fk in all_fks.values():
                            if fk['COLUMN_NAME'] not in excluded_cols:
                                col_defs.append(f"FOREIGN KEY ({fk['COLUMN_NAME']}) REFERENCES {fk['REFERENCED_TABLE_NAME']}({fk['REFERENCED_COLUMN_NAME']})")
                    table_defs[table] = f"({', '.join(col_defs)})"
            return table_defs
        finally:
            conn.close()
        
