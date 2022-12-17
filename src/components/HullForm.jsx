import React from 'react';
import { useFieldApi } from '@data-driven-forms/react-form-renderer';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

const classes = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
  },
  image: {
    position: 'relative',
    height: 200,
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        border: '4px solid currentColor',
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'black',
    opacity: 0.4,
    // transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: '2px 4px 7px',
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    // transition: theme.transitions.create('opacity'),
  }
};

const HullForm = (props) => {
    const { input, meta } = useFieldApi(props);

    return (
    <div className={classes.root}>
        <label>{props.label}</label>
        <input {...input} />
        {meta.error && <label>{meta.error}</label>}
      {props.options.map((image) => (
        <ButtonBase
          focusRipple
          key={image.title}
          className={classes.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: image.width,
          }}
        >
          <span
            className={classes.imageSrc}
            style={{
              backgroundImage: `url(${image.url})`,
            }}
          />
          <span className={classes.imageBackdrop} />
          <span className={classes.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classes.imageTitle}
            >
              {image.title}
              <span className={classes.imageMarked} />
            </Typography>
          </span>
        </ButtonBase>
      ))}
    </div>
  );
}

export default HullForm