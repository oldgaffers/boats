import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DropzoneArea } from "material-ui-dropzone";
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

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
  const { user } = useAuth0();
  const theme = useTheme();
  const classes = useStyles(theme);
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState(user && user.email);
  const [copyright, setCopyright] = useState(''); // user && user.name);

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
              value={copyright}
              required={true}
              type="text"
              label="Copyright Owner"
              onChange={onCopyright}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={email}
              required={true}
              label="Your Email"
              onChange={onEmail}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between">
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
