import React, { useState, useRef, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertToRaw, convertFromRaw } from 'draft-js'

const defaultTheme = createMuiTheme()

Object.assign(defaultTheme, {
  overrides: {
      MUIRichTextEditor: {
          root: {
            width: "100%"
          },
          toolbar: {
            borderTop: "1px solid gray",
            borderLeft: "1px solid gray",
            borderRight: "1px solid gray",
            backgroundColor: "whitesmoke"
          },
          editor: {
              border: "1px solid gray",
              marginBottom: 10,
              paddingLeft: '5px',
              paddingRight: '5px'
          }
      }
  }
})

function RTEtoHtml(data) {
  return stateToHTML(convertFromRaw(JSON.parse(data)));
}

function htmlToRTE(html) {
  const contentHTML = convertFromHTML(html || 'type some text ...');
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
      setState({ ...state, saving: 'no' });
      onSave(state.short, state.full);
      break;
    default:
      // console.log('effect do nothing');
    }
  }, [state, onSave]);

  const handleSaveShort = (rte) => {
    const short = RTEtoHtml(rte)
    setState({ ...state, short, saving: 'short' });
  };

  const handleSaveFull = (rte) => {
    const full = RTEtoHtml(rte)
    setState({ ...state, full, saving: 'full' });
  };

  const handleSave = () => {
    shortRef.current.save();
  }

  return (
    <Paper>
      <Typography variant="h6">Short description</Typography>
      <MuiThemeProvider theme={defaultTheme}>
        <MUIRichTextEditor
          controls={["bold", "italic"]}
          label="Start typing..."
          name='short_description'
          onSave={handleSaveShort}
          defaultValue={htmlToRTE(state.short)}
          maxLength="500"
          ref={shortRef}
        />
      </MuiThemeProvider>
      <Typography variant="h6">Full description</Typography>
      <MuiThemeProvider theme={defaultTheme}>
        <MUIRichTextEditor
          controls={["title", "bold", "italic", "numberList", "bulletList", "link" ]}
          label="Start typing..."
          name='full_description'
          onSave={handleSaveFull}
          defaultValue={htmlToRTE(state.full)}
          ref={fullRef}
        />
      </MuiThemeProvider>
      <Button variant="outlined" color="primary" onClick={onCancel}>Cancel</Button>
      <Button variant="outlined" color="primary" onClick={handleSave}>Send</Button>
    </Paper>
  );
}
