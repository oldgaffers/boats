import React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import usePagination from "@mui/material/usePagination";
import Stack from "@mui/material/Stack";
import { styled } from '@mui/material/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export function NewBoatPagination({ count, page, onChange }) {
  const middle = Math.floor(count / 2);
  return (
    <Stack spacing={2}>
      <Pagination count={count} page={page} color="primary"
        onChange={onChange}
      />
    </Stack>
  );
}

const List = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
});

export default function BoatPagination({ count, page, onChange }) {
  const { items } = usePagination({ count, page, onChange });
  const otherEllipsis = {
    disabled: false,
    onClick: undefined,
    page: null,
    selected: false,
    type: "other-ellipsis",
  };
  const startEllipsisItem = items.findIndex((cur) => cur.type === "start-ellipsis");
  if (startEllipsisItem >= 0) {
    const firstHalf = Math.floor(items[startEllipsisItem + 1].page / 2);
    const cutFront = {
      disabled: false,
      onClick: (event) => onChange(event, firstHalf),
      page: firstHalf,
      selected: false,
      type: "page",
    };
    items.splice(startEllipsisItem, 0, otherEllipsis, cutFront);
  }
  const endEllipsisItem = items.findIndex((cur) => cur.type === "end-ellipsis");
  if (endEllipsisItem >= 0) {
    const quarterPage = items[endEllipsisItem - 1].page;
    const lastHalf = quarterPage + Math.floor((count - quarterPage) / 2);
    const cutBack = {
      disabled: false,
      onClick: (event) => onChange(event, lastHalf),
      page: lastHalf,
      selected: false,
      type: "page",
    };
    items.splice(endEllipsisItem + 1, 0, cutBack, otherEllipsis);
  }
  return (
    <nav>
      <List>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;
          if (type.includes('ellipsis')) {
            children = (<PaginationItem type='start-ellipsis' />);
          } else if (type === 'page') {
            children=(<PaginationItem 
              aria-label={selected?`page ${page}`:`Go to page ${page}`} 
              color='primary'
              page={page}
              selected={selected}
              type={type}
              {...item}
            />)
          } else {
            children = (<PaginationItem              
              aria-label={`Go to ${type} page`}
              page={page}
              selected={selected}
              type={type}
              {...item}
            />);
          }
          return <li key={index}>{children}</li>;
        })}
      </List>
    </nav>
  );
}
