import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Dropzone, FileItem } from "@dropzone-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

export default function UpdatePhotoDialog({ boat, onClose, onCancel, open }) {
  const { user } = useAuth0();
  const [pictures, setPictures] = useState([]);
  const [email, setEmail] = useState(user && user.email);
  const [copyright, setCopyright] = useState(''); // user && user.name);

  const onDrop = (p) => {
    setPictures(p);
  };

  const onUpload = () => {
    onClose(
      copyright,
      email,
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

  const files = [];

  return (
    <Dialog aria-labelledby="updateboat-dialog-title" open={open}>
      <Paper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              Upload pictures for {boat.name} ({boat.oga_no})
            </Typography>
          </Grid>
          <Grid item xs={12}>
          <Dropzone onChange={onDrop} value={files}>
    {files.map((file) => (
      <FileItem {...file} preview />
    ))}
  </Dropzone>
     { //</Dropzone> maxFileSize={5242880}
     // acceptedFiles={["image/*"]}
}
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
              type="email"
              onChange={onEmail}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Button size="small" variant="contained" onClick={onCancel}>
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
