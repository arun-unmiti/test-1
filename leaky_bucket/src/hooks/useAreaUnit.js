import { useState, useEffect } from 'react';
import { getCoreLkp } from '../services/api';

// Module-level cache — one fetch for the whole session
let cache = null;

/**
 * Fetches the primary area unit label from GET /core/lkp/area_units.
 * Returns the first active unit's area_unit string (e.g. "Acres"),
 * or the fallback "Acres" while loading or on error.
 */
export function useAreaUnit(token) {
    const [unit, setUnit] = useState(cache?.unit || 'Acres');

    useEffect(() => {
        if (!token || cache) return;
        getCoreLkp(token, 'area_units')
            .then((res) => {
                const units = (res.data || []).filter((u) => u.status);
                const label = units[0]?.area_unit || 'Acres';
                cache = { unit: label };
                setUnit(label);
            })
            .catch(() => {});
    }, [token]);

    return unit;
}
