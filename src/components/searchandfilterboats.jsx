import React, { useState, useEffect, useContext } from "react";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";
import { Button, Typography } from "@mui/material";
import Picker from "./picker";
import NumberEntry from "./numberentry";
import DateRangePicker from "./daterangepicker";
import useDebounce from "../util/debounce";
import FleetButtons from "./fleetbuttons";
import { MarkContext } from "../browseapp";
import RoleRestricted from './rolerestrictedcomponent';

const opposite = { asc: "desc", desc: "asc" };

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

export default function SearchAndFilterBoats({
  sortDirection,
  sortField,
  boatsPerPage,
  filters,
  view,
  pickers,
  onFilterChange,
  onPageSizeChange = () => console.log('onPageSizeChange'),
  onSortChange = () => console.log('onSortChange'),
  onMarkedOnlyChange = (v) => console.log('onMarkedOnly', v),
  isMarkedOnly,
  onClearAllMarks=() => console.log('clear all marks'),
  onOwnedOnlyChange = (v) => console.log('onOwnedOnly', v),
  isOwnedOnly,
  enableOwnersOnly = false,
}) {
  const currentFilters = filters || {};
  const [ogaNo, setOgaNo] = useState(currentFilters.oga_no || '');
  const debouncedOgaNo = useDebounce(ogaNo, 1000);
  const markList = useContext(MarkContext);

  useEffect(() => {
    if (debouncedOgaNo !== '') {
      // console.log("use effect ogaNo, debounced oga no", ogaNo, debouncedOgaNo);
      if (ogaNo === "") {
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
    currentFilters.firstYear || pickers.year.min,
    currentFilters.lastYear || pickers.year.max,
  ];
  const [dr, setDr] = useState(dateRange);

  const handlePageSizeChange = (_, bpp) => {
    onPageSizeChange(parseInt(bpp, 10));
  };

  function pl(id, value) {
    if (value) {
      onFilterChange({ ...currentFilters, [id]: value });
    } else {
      const f = { ...currentFilters };
      delete f[id];
      onFilterChange(f);
    }
  }

  function handleDateRange(event, newValue) {
    setDr(newValue);
  }

  function handleDateRangeCommitted(event, [min, max]) {
    const f = { ...currentFilters };
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

  const sortOptions = [
    { field: "name", name: "Name", direction: "asc" },
    { field: "oga_no", name: "OGA No.", direction: "asc" },
    { field: "year", name: "Age", direction: "asc" },
    { field: "updated_at", name: "Updated", direction: "desc" },
    { field: "length_on_deck", name: "Length", direction: "desc" },
    { field: "rank", name: "Editor's choice", direction: "asc" },
  ];
  if (view === 'sell') {
    sortOptions.push({ field: "price", name: "Price", direction: "desc" });
  }
  const sortLabelByField = sortOptions.reduce((r, { field, name }) => {
    r[field] = name;
    return r;
  }, {});
  const sortDirectionByField = sortOptions.reduce((r, { field, direction }) => {
    r[field] = direction;
    return r;
  }, {});

  function handleSortFieldChange(event) {
    const field = event.target.value;
    if (field !== sortField) {
      const normal = sortDirectionByField[field];
      onSortChange(field, normal);
    }
  }

  function handleSortDirectionChange(event) {
    const normal = sortDirectionByField[sortField];
    const dir = event.target.checked ? opposite[normal] : normal;
    if (dir !== sortDirection) {
      onSortChange(sortField, dir);
    }
  }

  function filterByFleet(name, filters) {
    // filters always contains the filters in case we need to do
    // clever stuff if other filters are set as well as fleet
    // but name is cleared if we need to clear the fleet filter
    if (name) {
      onFilterChange(filters, name);
    } else {
      onFilterChange({});
    }
  }

  return (
    <form>
      <FormHelperText sx={{ marginLeft: "1em", marginBottom: "3px" }}>
        Use these controls to sort the list by name, price, etc. and to choose
        how much you want to see
      </FormHelperText>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="flex-end"
      >
        <Grid item>
          <Picker
            clearable={false}
            value={`${boatsPerPage}`}
            id="page-size"
            onChange={handlePageSizeChange}
            options={pageSize}
            label="Boats Per Page"
          />
        </Grid>
        <Grid item>
          <FormControl sx={{ marginLeft: "1.5em" }}>
            <FormLabel>Sort By</FormLabel>
            <RadioGroup
              row
              aria-label="sorting"
              name="sorting"
              value={sortLabelByField[sortField]}
              onChange={handleSortFieldChange}
            >
              {sortOptions.map((option) => (
                <FormControlLabel
                  key={option.name}
                  value={option.field}
                  sx={{ marginRight: "1em", borderRightWidth: "1vw" }}
                  control={<Radio checked={sortField === option.field} />}
                  label={option.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl sx={{ marginLeft: "1.5em" }}>
            <FormLabel>Sort Direction</FormLabel>
            <FormControlLabel
              id="sort-direction"
              onChange={handleSortDirectionChange}
              control={
                <Switch
                  checked={sortDirection !== sortDirectionByField[sortField]}
                />
              }
              label="reversed"
            />
          </FormControl>
        </Grid>
      </Grid>
      <Divider />
      <FormHelperText sx={{ marginLeft: "1em", marginBottom: "3px" }}>
        Use these controls to filter the list in one or more ways
      </FormHelperText>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
      >
        <Grid item>
          <Picker
            onChange={pl}
            id="name"
            options={makePicklist(view, pickers, "name")}
            label="Boat Name"
            value={currentFilters["name"]}
          />
        </Grid>
        <Grid item>
          <NumberEntry
            id="oga_no"
            label="OGA Boat No."
            value={ogaNo}
            onSet={setOgaNo}
            onClear={() => { setOgaNo(''); }}
          />
        </Grid>
        <Grid item>
          <Picker
            onChange={pl}
            id="designer"
            options={makePicklist(view, pickers, "designer")}
            label="Designer"
            value={currentFilters["designer"]}
          />
        </Grid>
        <Grid item>
          <Picker
            onChange={pl}
            id="builder"
            options={makePicklist(view, pickers, "builder")}
            label="Builder"
            value={currentFilters["builder"]}
          />
        </Grid>
        <Grid item>
          <Picker
            onChange={pl}
            id="rig_type"
            options={makePicklist(view, pickers, "rig_type")}
            label="Rig Type"
            value={currentFilters["rig_type"]}
          />
        </Grid>
        <Grid item>
          <Picker
            onChange={pl}
            id="mainsail_type"
            options={makePicklist(view, pickers, "mainsail_type")}
            label="Mainsail Type"
            value={currentFilters["mainsail_type"]}
          />
        </Grid>
        <Grid item>
          <Picker
            onChange={pl}
            id="generic_type"
            options={makePicklist(view, pickers, "generic_type")}
            label="Generic Type"
            value={() => {
              const f = currentFilters["generic_type"];
              if (Array.isArray(f)) {
                return ""; // don't make a selection if multiple selected
              }
              return f;
            }}
          />
        </Grid>
        <Grid item>
          <Picker
            onChange={pl}
            id="design_class"
            options={makePicklist(view, pickers, "design_class")}
            label="Design Class"
            value={currentFilters["design_class"]}
          />
        </Grid>
        <Grid item>
          <Picker
            onChange={pl}
            id="construction_material"
            options={makePicklist(view, pickers, "construction_material")}
            label="Construction Material"
            value={currentFilters["construction_material"]}
          />
        </Grid>
        <Grid item>
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
        <Grid item>
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
        <Grid item>
        </Grid>
        <Grid item>
          <RoleRestricted role='member'>
            <FleetButtons filters={filters} onChange={filterByFleet} />
          </RoleRestricted>
        </Grid>
        <RoleRestricted role='member'>
          <Grid item>
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
        </RoleRestricted>
      </Grid>
    </form>
  );
}
