import React, { useRef } from "react";
import Typography from '@mui/material/Typography';
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import MUIRichTextEditor from 'mui-rte';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, ContentState, convertFromRaw, convertToRaw } from 'draft-js'

function htmlToRTE(html) {
  const contentHTML = convertFromHTML(html || '<p><br/></p>');
  return ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
}

export const HtmlEditor = ({ component, name, title, ...rest }) => {

  const ref = useRef(null);
  const { input } = useFieldApi({component, name});

 const handleBlur = () => {
    console.log('RTE blur', input.name, ref);
    ref.current.save();
  }

  const handleSave = (data) => {
    const html = stateToHTML(convertFromRaw(JSON.parse(data)));
    console.log('RTE save', input.name, html);
    input.onChange(html);  
  }

  return (<div
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.stopPropagation();
    }
  }}
  >
  <Typography>{title}</Typography>
  <MUIRichTextEditor
  label='type some text'
  {...rest}
  defaultValue={JSON.stringify(convertToRaw(htmlToRTE(input.value)))}
  onSave={handleSave}
  onBlur={handleBlur}
  ref={ref}
  />
  </div>);
}