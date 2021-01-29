import React, { useRef } from "react";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { createMuiTheme } from '@material-ui/core/styles'
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertFromRaw, convertToRaw } from 'draft-js'

export const theme = createMuiTheme()

Object.assign(theme, {
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

function htmlToRTE(html) {
  const contentHTML = convertFromHTML(html || '');
  const contentState = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
  return JSON.stringify(convertToRaw(contentState));
}

export const HtmlEditor = (props) => {

    const ref = useRef(null);
    const { input, meta } = useFieldApi(props);

    const handleBlur = () => {
        console.log('RTE blur', input.name, ref);
        ref.current.save();
    }

    const handleSave = (data) => {
        const html = stateToHTML(convertFromRaw(JSON.parse(data)));
        console.log('RTE save', input.name, html);
        input.onChange(html);
    }

    return <>
    {props.title}
    <MUIRichTextEditor
    controls={props.controls}
    onSave={handleSave}
    defaultValue={htmlToRTE(input.value)}
    onBlur={handleBlur}
    ref={ref}
    />
    </>;
}
