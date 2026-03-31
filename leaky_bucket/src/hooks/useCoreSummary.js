import { useState, useEffect } from 'react';
import { getCoreSummary } from '../services/api';

/**
 * Fetches aggregate summary from POST /core/summary.
 * Re-fetches when form_id or locFilter changes.
 * Returns { summary, summaryLoading }
 */
export function useCoreSummary(token, form_id, locFilter = {}) {
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(true);

    useEffect(() => {
        if (!token || !form_id) return;
        setSummaryLoading(true);
        getCoreSummary(token, form_id, locFilter)
            .then((res) => setSummary(res.data || {}))
            .catch(() => setSummary({}))
            .finally(() => setSummaryLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, form_id, JSON.stringify(locFilter)]);

    return { summary, summaryLoading };
}
