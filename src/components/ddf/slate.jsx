import React, { useState } from 'react';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// Import the Slate editor factory.
import { createEditor } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';
const testInitialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];
export default function HtmlEditor({
    component, name, title = '', helperText = '', height = 10, maxLength, initialValue }) {
    // console.log('editor TODO maxLength', maxLength);
    const [editor] = useState(() => withReact(createEditor()));
    const { input } = useFieldApi({ component, name });
    return (
        <>
            <Stack direction='column'>
                <Typography sx={{ paddingTop: "1em" }}>{title}</Typography>
                <Slate editor={editor} initialValue={testInitialValue}>
                   <Editable 
                   onKeyDown={event => {
          if (event.key === 'Enter') {
            // Prevent the enter key from being inserted.
            event.preventDefault();
            event.stopPropagation();
            // Execute the `insertText` method when the event occurs.
            editor.insertBreak(editor);
          }
        }}
                   /> 
                </Slate>
                <Typography variant='caption'>{helperText}</Typography>
            </Stack>
        </>
    );

}

