import { useState, useEffect } from 'react';
import { getFormFields } from '../services/api';

// Module-level cache — persists for the browser session, no re-fetching on tab switch
const cache = {};

/**
 * Fetches field definitions for a given form_id from GET /form/fields.
 * Returns { columns, labelMap, ready }
 *
 * columns  — [{ key: "field_5002", label: "Name" }, ...]  ordered by DB order_by
 * labelMap — { "field_5002": "Name", ... }  for quick lookup
 * ready    — true once the fetch completes (success or error)
 */
export function useFormFields(token, form_id) {
    const [state, setState] = useState(
        () => cache[form_id] || { columns: [], labelMap: {}, ready: false }
    );

    useEffect(() => {
        if (!token || !form_id) return;

        // Already cached — just sync state
        if (cache[form_id]) {
            setState(cache[form_id]);
            return;
        }

        getFormFields(token, form_id)
            .then((res) => {
                const fields = res.data || [];
                const labelMap = {};
                const columns = [];

                // Collect all parent_id values — these are group/section header fields,
                // not actual data fields, so we exclude them from columns
                const parentIds = new Set(fields.map((f) => f.parent_id).filter(Boolean));

                fields.forEach((f) => {
                    if (parentIds.has(f.field_id)) return; // skip group headers
                    // Data response always uses field_${field_id} as the key
                    const key = `field_${f.field_id}`;
                    const label = f.label || key;
                    labelMap[key] = label;
                    columns.push({ key, label });
                });
                const result = { columns, labelMap, ready: true };
                cache[form_id] = result;
                setState(result);
            })
            .catch(() => {
                const result = { columns: [], labelMap: {}, ready: true };
                cache[form_id] = result;
                setState(result);
            });
    }, [token, form_id]);

    return state;
}
