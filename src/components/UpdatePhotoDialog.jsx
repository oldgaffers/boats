import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { DropzoneArea } from "material-ui-dropzone";

export const theme = createMuiTheme();

Object.assign(theme, {
  overrides: {
    root: {
      width: "100%",
      border: "1px",
      paddingLeft: "50px",
      paddingRight: "50px",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function UpdatePhotoDialog({ boat, onClose, open }) {
  const classes = useStyles();
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState(undefined);
  const [copyright, setCopyright] = useState(undefined);

  const onDrop = (p) => {
    setPictures(p);
  };

  const onUpload = () => {
    onClose(
      {
        name: boat.name,
        albumKey: boat.image_key,
        oga_no: boat.oga_no,
        copyright,
        email,
      },
      pictures
    );
  };

  const ready = () => {
    if (pictures.length === 0) return false;
    if (!email) return false;
    if (!copyright) return false;
    return true;
  };

  const onEmail = (e) => {
    setEmail(e.target.value);
  };

  const onCopyright = (e) => {
    setCopyright(e.target.value);
  };

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              Upload pictures for {boat.name} ({boat.oga_no})
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <DropzoneArea
              maxFileSize={5242880}
              acceptedFiles={["image/*"]}
              onChange={onDrop}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required={true}
              type="text"
              label="Copyright Owner"
              onChange={onCopyright}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required={true}
              type="email"
              label="Your Email"
              onChange={onEmail}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="space-between">
              <Grid item>
                <Button size="small" variant="contained" onClick={onClose}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  disabled={!ready()}
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={onUpload}
                >
                  Upload
                </Button>                
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Dialog>
  );
}

UpdatePhotoDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
