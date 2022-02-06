import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import YAML from 'yaml'
import { diffLines } from 'diff';

export default function ChangeViewer({ onClose, open, change }) {
    const handleClose = () => {
        console.log('ChangeViewer close');
        onClose();
    }
    const oldy = YAML.stringify(change.old);
    const newy = YAML.stringify(change.new);
    const json = diffLines(oldy, newy, { context: 0 });
    const ok = Object.keys(change.old);
    const different = Object.keys(change.new).filter((key) => {
        console.log(key, change.old[key], change.new[key]);
        if (ok.includes(key)) {
            if (Array.isArray(change.old[key])) {
                if (change.old[key].length !== change.new[key].length) {
                    return true;
                }
                if (change.old[key].length === 0) {
                    return false;
                }
                return change.old[key] == change.new[key];
            } else if (change.old[key] === change.new[key]) {
                return false;
            }
        }
        return true;
    });
    console.log(different);
    return (
        <>
        <Dialog open={open}>
        <DialogTitle>Change for {change.old.name} ({change.old.oga_no})</DialogTitle>
        <DialogContent>
          <DialogContentText id="change-viewer">
              {json.map((part) => {
            const text = part.value.trim();
        if (part.added) return (<div style={{backgroundColor:'palegreen'}}>{text}</div>);
        if (part.removed) return (<div style={{backgroundColor:'lightpink'}}>{text}</div>);
        return (<div>&nbsp;</div>);
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
        </Dialog>
        </>
    );
}