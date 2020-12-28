import React from 'react';
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertToRaw, convertFromRaw } from 'draft-js'

export default function ReallyDumbRTE({
    value,
    name,
    onSave = (editorState) => {},
  }) {
  
    function handleSave(data) {
      onSave(stateToHTML(convertFromRaw(JSON.parse(data))));
    }

    const contentHTML = convertFromHTML(value);
    const contentState = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
    const data = JSON.stringify(convertToRaw(contentState));
  
    return (
      <>
        <MUIRichTextEditor
          label="Start typing..."
          name={name}
          onSave={handleSave}
          value={data}
        />
      </>
    );
}

