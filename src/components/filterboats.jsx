import React, { useState, useEffect, useContext } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Picker from "./picker";
import NumberEntry from "./numberentry";
import DateRangePicker from "./daterangepicker";
import useDebounce from "../util/debounce";
import FleetButtons from "./fleetbuttons";
import { MarkContext } from "./browseapp";
import RoleRestricted from './rolerestrictedcomponent';

const pageSize = [];
for (let i = 1; i <= 8; i++) {
    pageSize.push({ name: `${6 * i}` });
}

function makePicklist(view, pickers, field) {
    if (pickers[field] && pickers[field].length > 0) {
        const p = pickers[field]
        const pl = [...new Set(p)].map((item) => ({ name: item }));
        return pl;
    }
    return [];
}

export default function FilterBoats({
    filters,
    view,
    pickers,
    onFilterChange,
    onMarkedOnlyChange = (v) => console.log('onMarkedOnly', v),
    isMarkedOnly,
    onClearAllMarks = () => console.log('clear all marks'),
    onOwnedOnlyChange = (v) => console.log('onOwnedOnly', v),
    isOwnedOnly,
    enableOwnersOnly = false,
    onIsMemberBoatChange = (v) => console.log('onIsMemberBoat', v),
    isMemberBoat,
    filtered,
    fleets,
    fleetName,
    onFleetSelected,
    onFleetChange,
}) {
    const [ogaNo, setOgaNo] = useState(filters.oga_no || '');
    const debouncedOgaNo = useDebounce(ogaNo, 1000);
    const markList = useContext(MarkContext);

    useEffect(() => {
        if (debouncedOgaNo !== '') {
            // console.log("use effect ogaNo, debounced oga no", ogaNo, debouncedOgaNo);
            if (ogaNo === "") {
                // eslint-disable-next-line no-unused-vars
                const { oga_no, ...f } = filters;
                onFilterChange(f);
            } else if (filters?.oga_no) {
                // console.log("new", debouncedOgaNo, "old", filters.oga_no);
                const newNo = debouncedOgaNo;
                if (newNo !== filters.oga_no) {
                    onFilterChange({ ...filters, oga_no: newNo });
                }
            } else {
                onFilterChange({ ...filters, oga_no: debouncedOgaNo });
            }
        }
    }, [debouncedOgaNo, filters, onFilterChange, ogaNo]);

    const dateRange = [
        filters.firstYear || pickers.year.min,
        filters.lastYear || pickers.year.max,
    ];
    const [dr, setDr] = useState(dateRange);

    function pl(id, value) {
        if (value) {
            onFilterChange({ ...filters, [id]: value });
        } else {
            const f = { ...filters };
            delete f[id];
            onFilterChange(f);
        }
    }

    function handleDateRange(event, newValue) {
        setDr(newValue);
    }

    function handleDateRangeCommitted(event, [min, max]) {
        const f = { ...filters };
        if (min === pickers.year.min) {
            delete f.firstYear;
        } else {
            f.firstYear = min;
        }
        if (max === pickers.year.max) {
            delete f.lastYear;
        } else {
            f.lastYear = max;
        }
        onFilterChange(f);
    }

    return (
        <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
        >
            <Grid>
                <Picker
                    onChange={pl}
                    id="name"
                    options={makePicklist(view, pickers, "name")}
                    label="Boat Name"
                    value={filters["name"]}
                />
            </Grid>
            <Grid>
                <NumberEntry
                    id="oga_no"
                    label="OGA Boat No."
                    value={ogaNo}
                    onSet={setOgaNo}
                    onClear={() => { setOgaNo(''); }}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="designer"
                    options={makePicklist(view, pickers, "designer")}
                    label="Designer"
                    value={filters["designer"]}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="builder"
                    options={makePicklist(view, pickers, "builder")}
                    label="Builder"
                    value={filters["builder"]}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="rig_type"
                    options={makePicklist(view, pickers, "rig_type")}
                    label="Rig Type"
                    value={filters["rig_type"]}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="mainsail_type"
                    options={makePicklist(view, pickers, "mainsail_type")}
                    label="Mainsail Type"
                    value={filters["mainsail_type"]}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="generic_type"
                    options={makePicklist(view, pickers, "generic_type")}
                    label="Generic Type"
                    value={() => {
                        const f = filters["generic_type"];
                        if (Array.isArray(f)) {
                            return ""; // TODO support multiple
                        }
                        return f;
                    }}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="design_class"
                    options={makePicklist(view, pickers, "design_class")}
                    label="Design Class"
                    value={filters["design_class"]}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="construction_material"
                    options={makePicklist(view, pickers, "construction_material")}
                    label="Construction Material"
                    value={filters["construction_material"]}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="place_built"
                    options={makePicklist(view, pickers, "place_built")}
                    label="Place Built"
                    value={filters["place_built"]}
                />
            </Grid>
            <Grid>
                <Picker
                    onChange={pl}
                    id="home_port"
                    options={makePicklist(view, pickers, "home_port")}
                    label="Home Port"
                    value={filters["home_port"]}
                />
            </Grid>
            <Grid>
                <DateRangePicker
                    value={dr}
                    yearProps={pickers.year}
                    label={`Built Between: ${dateRange[0]} and ${dateRange[1]}`}
                    onChange={handleDateRange}
                    onChangeCommitted={handleDateRangeCommitted}
                    min={pickers.year.min}
                    max={pickers.year.max}
                    step={pickers.year.step}
                />
            </Grid>
            <Grid>
                <FormControlLabel
                    disabled={markList.length === 0}
                    id="marked"
                    onChange={(event) => onMarkedOnlyChange(event.target.checked)}
                    control={<Switch checked={isMarkedOnly} />}
                    label="Only Marked Boats"
                />
            </Grid>
            <Button
                disabled={markList.length === 0}
                onClick={onClearAllMarks}
                variant='contained' size='small' color='secondary'
            >Clear Marks</Button>
            <RoleRestricted role='member'>
                <Grid>
                    <FleetButtons
                        onSelectionChange={onFleetSelected}
                        onFleetsUpdated={onFleetChange}
                        filters={filters}
                        filtered={filtered}
                        fleets={fleets}
                        fleetName={fleetName}
                    />
                </Grid>
                <Grid>
                    <FormControlLabel
                        disabled={!enableOwnersOnly}
                        id="owned"
                        onChange={(event) => onOwnedOnlyChange(event.target.checked)}
                        control={<Switch sx={{ marginLeft: '30px' }} checked={!!isOwnedOnly} />}
                        label="Only My Boats"
                    />
                </Grid>
                {
                    (enableOwnersOnly) ?
                        ''
                        :
                        <Grid item padding={'1px'} margin='1px'>
                            <Typography>
                                We don't have a record of you owning any boats.
                            </Typography><Typography>
                                Tell us about a boat you own by clicking
                                on the boat's More button.
                            </Typography><Typography>
                                If your boat isn't on the register, click the add boat button.
                            </Typography>
                        </Grid>
                }
                <Grid>
                                        <FormControlLabel
                                            disabled={false}
                                            id="membersBoats"
                                            onChange={(event) => onIsMemberBoatChange(event.target.checked)}
                                            control={<Switch sx={{ marginLeft: '30px' }} checked={!!isMemberBoat} />}
                                            label="Members Boats Only"
                                        />
                                    </Grid>
            </RoleRestricted>
        </Grid>
    );
}