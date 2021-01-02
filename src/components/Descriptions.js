import React, { useState, useRef, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertToRaw, convertFromRaw } from 'draft-js'

function RTEtoHtml(data) {
  return stateToHTML(convertFromRaw(JSON.parse(data)));
}

function htmlToRTE(html) {
  const contentHTML = convertFromHTML(html);
  const contentState = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
  return JSON.stringify(convertToRaw(contentState));
}

export default function Descriptions({ classes, onCancel, onSave, short, full }) {

  const [state, setState] = useState({ short, full, saving: 'no' });
  const shortRef = useRef(null);
  const fullRef = useRef(null);

  useEffect(() => {
    switch (state.saving) {
    case 'short':
      fullRef.current.save();
      break;
    case 'full':
      console.log('save both');
      setState({ ...state, saving: 'no' });
      onSave(state.short, state.full);
      break;
    default:
      console.log('effect do nothing');
    }
  }, [state, onSave]);

  const handleSaveShort = (rte) => {
    const short = RTEtoHtml(rte)
    console.log('save short', short);
    setState({ ...state, short, saving: 'short' });
  };

  const handleSaveFull = (rte) => {
    const full = RTEtoHtml(rte)
    console.log('save full', full);
    setState({ ...state, full, saving: 'full' });
  };

  const handleSave = () => {
    console.log('save');
    shortRef.current.save();
  }

  return (
    <Paper className={classes.paper}>
        <Typography variant="h6">Short description</Typography>
        <MUIRichTextEditor
          controls={["bold", "italic"]}
          label="Start typing..."
          name='short_description'
          onSave={handleSaveShort}
          defaultValue={htmlToRTE(state.short)}
          maxLength="500"
          ref={shortRef}
        />
        <Typography variant="h6">Full description</Typography>
        <MUIRichTextEditor
          controls={["title", "bold", "italic", "numberList", "bulletList", "link", "media" ]}
          label="Start typing..."
          name='full_description'
          onSave={handleSaveFull}
          defaultValue={htmlToRTE(state.full)}
          ref={fullRef}
        />
      <Button variant="outlined" color="primary" onClick={onCancel}>Cancel</Button>
      <Button variant="outlined" color="primary" onClick={handleSave}>Save</Button>
    </Paper>
  );
}
