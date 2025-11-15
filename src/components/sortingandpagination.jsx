import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Picker from "./picker";

const opposite = { asc: "desc", desc: "asc" };

const pageSize = [];
for (let i = 1; i <= 8; i++) {
  pageSize.push({ name: `${6 * i}` });
}

export default function SortingAndPagination({
  sortDirection,
  sortField,
  boatsPerPage,
  view,
  onPageSizeChange = () => console.log('onPageSizeChange'),
  onSortChange = () => console.log('onSortChange'),
}) {

  const handlePageSizeChange = (_, bpp) => {
    onPageSizeChange(parseInt(bpp, 10));
  };

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

  return (
    <>
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
    </>
  );
}
