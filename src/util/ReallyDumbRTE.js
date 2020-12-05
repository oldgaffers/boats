import React from 'react';
import MUIRichTextEditor from 'mui-rte';
import Typography from '@material-ui/core/Typography';

export default function ReallyDumbRTE({
    label,
    state,
    onChange = (editorState) => {},
    onSave = (editorState) => {},
  }) {
    let name = label.replace(/ /g, '_').toLowerCase();
  
    function handleSave(data) {
      // console.log(data);
      const newstate = { ...state };
      newstate[name] = data;
      onSave(newstate);
    }
  
    return (
      <>
        <Typography>{label}</Typography>
        <MUIRichTextEditor
          label="Start typing..."
          name={name}
          onChange={onChange}
          onSave={handleSave}
          value={state[name]}
        />
      </>
    );
  }