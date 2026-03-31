import { useState, useEffect } from "react";
import { getLocationAdm, getLocationAdmLevel } from "../services/api";

/**
 * Cascading location filter: Country → adm1 → adm2 → adm3
 * Props:
 *   token     - auth token
 *   onChange  - called with { adm0_id, adm1_id, adm2_id, adm3_id, currency }
 */
function LocationFilter({ token, onChange }) {
    const [countries, setCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [subRegions, setSubRegions] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [adm0, setAdm0] = useState("");
    const [adm1, setAdm1] = useState("");
    const [adm2, setAdm2] = useState("");
    const [adm3, setAdm3] = useState("");

    // Dynamic label names per country (level → label)
    const [levelLabels, setLevelLabels] = useState({});
    // Selected country's currency
    const [currency, setCurrency] = useState(null);

    // Load countries on mount
    useEffect(() => {
        getLocationAdm(token, 0, null)
            .then((res) => setCountries((res.data?.units || []).sort((a, b) => a.name.localeCompare(b.name))))
            .catch(() => {});
    }, [token]);

    const handleCountry = (e) => {
        const val = e.target.value;
        setAdm0(val);
        setAdm1(""); setAdm2(""); setAdm3("");
        setRegions([]); setSubRegions([]); setDistricts([]);
        setLevelLabels({});

        const selectedCountry = countries.find((c) => String(c.id) === String(val));
        const cur = selectedCountry?.currency || null;
        setCurrency(cur);

        onChange({ adm0_id: val || null, adm1_id: null, adm2_id: null, adm3_id: null, currency: cur });

        if (val) {
            // Load sub-level locations
            getLocationAdm(token, 1, val)
                .then((res) => setRegions((res.data?.units || []).sort((a, b) => a.name.localeCompare(b.name))))
                .catch(() => {});
            // Load admin level names for this country
            getLocationAdmLevel(token, val)
                .then((res) => {
                    const labels = {};
                    (res.data || []).forEach((l) => { labels[l.level] = l.level_name; });
                    setLevelLabels(labels);
                })
                .catch(() => {});
        }
    };

    const handleRegion = (e) => {
        const val = e.target.value;
        setAdm1(val);
        setAdm2(""); setAdm3("");
        setSubRegions([]); setDistricts([]);
        onChange({ adm0_id: adm0 || null, adm1_id: val || null, adm2_id: null, adm3_id: null, currency });
        if (val) {
            getLocationAdm(token, 2, val)
                .then((res) => setSubRegions((res.data?.units || []).sort((a, b) => a.name.localeCompare(b.name))))
                .catch(() => {});
        }
    };

    const handleSubRegion = (e) => {
        const val = e.target.value;
        setAdm2(val);
        setAdm3("");
        setDistricts([]);
        onChange({ adm0_id: adm0 || null, adm1_id: adm1 || null, adm2_id: val || null, adm3_id: null, currency });
        if (val) {
            getLocationAdm(token, 3, val)
                .then((res) => setDistricts((res.data?.units || []).sort((a, b) => a.name.localeCompare(b.name))))
                .catch(() => {});
        }
    };

    const handleDistrict = (e) => {
        const val = e.target.value;
        setAdm3(val);
        onChange({ adm0_id: adm0 || null, adm1_id: adm1 || null, adm2_id: adm2 || null, adm3_id: val || null, currency });
    };

    const label1 = levelLabels[1] ? `All ${levelLabels[1]}s` : "All Regions";
    const label2 = levelLabels[2] ? `All ${levelLabels[2]}s` : "All Sub-Regions";
    const label3 = levelLabels[3] ? `All ${levelLabels[3]}s` : "All Districts";

    return (
        <div className="row">
            <div className="col-sm-12 col-md-3 col-lg-3">
                <select className="form-select" value={adm0} onChange={handleCountry}>
                    <option value="">All Countries</option>
                    {countries.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3">
                <select className="form-select" value={adm1} onChange={handleRegion} disabled={!adm0}>
                    <option value="">{label1}</option>
                    {regions.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3">
                <select className="form-select" value={adm2} onChange={handleSubRegion} disabled={!adm1}>
                    <option value="">{label2}</option>
                    {subRegions.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-sm-12 col-md-3 col-lg-3">
                <select className="form-select" value={adm3} onChange={handleDistrict} disabled={!adm2}>
                    <option value="">{label3}</option>
                    {districts.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default LocationFilter;
