import React, { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import SendIcon from "@mui/icons-material/Send";
import MailIcon from "@mui/icons-material/Mail";
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useLazyQuery } from "@apollo/client";
import { postGeneralEnquiry } from "./boatregisterposts";

function ContactDialog({
  open,
  boat_name,
  oga_no,
  user,
  isMember,
  owners,
  onSend,
  onCancel,
  title,
  topic
}) {
  const [email, setEmail] = useState(user?.email || '');
  const [text, setText] = useState("");
  const [valid, setValid] = useState(!!email);

  const onClickSend = () => {
    onSend({ type: topic, boat_name, oga_no, text, email, owners });
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setValid(e.target.reportValidity());
  };

  const subtitle = () => {
    if (owners && owners.length > 0) {
      if (owners.length > 1) {
        return (<><i>{boat_name}</i> ({oga_no})
          is owned by {isMember ? 'fellow members' : 'members'} of the OGA.
          We'll contact them for you from the boat register and give them your email so they can respond.</>);
      } else {
        return (<><i>{boat_name}</i> ({oga_no})
          is owned by a{isMember ? ' fellow ' : ' '}member of the OGA.
          We'll contact them for you from the boat register and give them your email so they can respond.</>);
      }
    } else {
      if (isMember) {
        return (<>Own <i>{boat_name}</i> ({oga_no}) or have some information or a
          question about her? We'd love to hear from you. Please tell us how we can help.</>);
      } else {
        return (<>Own <i>{boat_name}</i> ({oga_no}) or have some information or a
          question about her? We'd love to hear from you. Please enter your email address here
          and tell us how we can help.</>);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="subtitle2">
          {subtitle()}
        </DialogContentText>
        <TextField
          value={email}
          error={email === ""}
          onChange={handleEmailChange}
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
        />
        <TextField
          onChange={(e) => setText(e.target.value)}
          margin="dense"
          label="About your enquiry"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button
          endIcon={<SendIcon />}
          onClick={onClickSend}
          color="primary"
          disabled={!valid}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Enquiry({ boat, text }) {
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const { user } = useAuth0();
  const userRoles = (user && user['https://oga.org.uk/roles']) || [];

  const [getOwners, { loading, error, data }] = useLazyQuery(gql(`query members($members: [Int]) {
    members(members: $members) { GDPR }
  }`));
  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error}`;

  const member = userRoles?.includes('member') || false;

  const handleClickOpen = () => {
    if (member) {
      const current = boat?.ownerships?.filter((o) => o.current) || [];
      if (current.length > 0) {
        const memberNumbers = [...new Set(current.map((owner) => owner.member))];
        getOwners({ variables: { members: memberNumbers } })  
      }
    } else {
      // console.log('not member - userRoles', userRoles);
    }
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  function handleSnackBarClose() {
    setSnackBarOpen(false);
  }

  const handleSend = ({ id, boat_name, oga_no, type, email, text, owners }) => {
    setOpen(false);
    const data = { type, id, boat_name, oga_no, email, text, owners, member };
    if (user?.name) {
      data.name = user.name;
    }
    postGeneralEnquiry('public', 'enquiry', data)
      .then((response) => {
        setSnackBarOpen(true);
      })
      .catch((error) => {
        // console.log("post", error);
        // TODO snackbar from response.data
      });
  };

  const current = boat.ownerships?.filter((o) => o.current) || [];

  const isMember = userRoles.includes('member');
  let enquireText = text;
  if (!text) {
    if (current) {
      if (current.length > 1) {
        enquireText = "Contact the Owners";
      } else {
        enquireText = "Contact the Owner";
      }
    } else {
      enquireText = "Ask about this boat";
    }
  }

  return (
    <>
      <Button
        size="small"
        endIcon={<MailIcon />}
        variant="contained"
        color="success"
        onClick={handleClickOpen}
      >
        {enquireText}
      </Button>
      <ContactDialog
        open={open}
        boat_name={boat.name}
        oga_no={boat.oga_no}
        user={user}
        owners={current}
        isMember={isMember}
        members={data?.members}
        onCancel={handleCancel}
        onSend={handleSend}
        title={enquireText}
        topic={current ? 'contact' : 'general'}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackBarOpen}
        autoHideDuration={2000}
        onClose={handleSnackBarClose}
        message="Thanks, we'll get back to you."
        severity="success"
      />
    </>
  );
}