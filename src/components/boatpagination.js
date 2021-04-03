import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    ul: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
    },
    buttonSelected: {
       fontWeight: 'bold'
    }
  }));

export default function BoatPagination({items}) {
    const classes = useStyles();
    return (
      <nav>
        <ul className={classes.ul}>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;
            switch (type) {
              case 'other-ellipsis':
              case 'start-ellipsis':
              case 'end-ellipsis':
                children = '…';
              break;
              case 'page':
                children = (
                <button
                    type="button" {...item} 
                    className={selected?classes.buttonSelected:undefined}
                >
                    {page}
                </button>
              );
              break;
              case 'fast-forward':
                  // children = (<Icon component="button" {...item} >fast_forward</Icon>);
                break;
                case 'fast-rewind':
                  // children = (<Icon component="button" {...item} >fast_rewind</Icon>);
                break;
              default:
                children = (
                <button type="button" {...item}>
                  {type}
                </button>
              );
            }
            return <li key={index}>{children}</li>;
          })}
        </ul>
      </nav>
    );
  }