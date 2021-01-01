import React, { useMemo, useState } from 'react'
import Button from '@material-ui/core/Button';
import FormatAlignLeft from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRight from '@material-ui/icons/FormatAlignRight';
import FormatAlignCenter from '@material-ui/icons/FormatAlignCenter';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
// import Movie from '@material-ui/icons/Movie';
import Link from '@material-ui/icons/Link/';
import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import LooksOne from '@material-ui/icons/LooksOne';
import LooksTwo from '@material-ui/icons/LooksTwo';
// import Looks3 from '@material-ui/icons/Looks3';
import { withReact, Slate } from 'slate-react'
import { withHistory } from 'slate-history';
import { createEditor } from 'slate';
import {
  AlignPlugin,
  BoldPlugin,
  EditablePlugins,
  HeadingPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  MediaEmbedPlugin,
  ParagraphPlugin,
  pipe,
  HeadingToolbar,
  ToolbarAlign,
  ToolbarElement,
  ToolbarLink,
  ToolbarList,
  ToolbarMark,
} from '@udecode/slate-plugins';
import { 
  deserializeHTMLToDocumentFragment,
  serializeHTMLFromNodes,
 } from '@udecode/slate-plugins';

const withPlugins = [withReact, withHistory];
const pluginsMin = [BoldPlugin(), ItalicPlugin(), ParagraphPlugin()];
const pluginsMax = [
  AlignPlugin(),
  BoldPlugin(), 
  HeadingPlugin(), 
  ItalicPlugin(),
  LinkPlugin(), 
  ListPlugin(), 
  MediaEmbedPlugin(),
  ParagraphPlugin()
];

const ToolBarMin = () => {
  return (
    <HeadingToolbar>
      <ToolbarMark type="bold" icon={<FormatBold />} />
      <ToolbarMark type="italic" icon={<FormatItalic />} />
    </HeadingToolbar>
  );
}

const ToolBarMax = () => {
  return (
    <HeadingToolbar>
      <ToolbarMark type="bold" icon={<FormatBold />} />
      <ToolbarMark type="italic" icon={<FormatItalic />} />
      <ToolbarElement type="h1" icon={<LooksOne />} />
      <ToolbarElement type="h2" icon={<LooksTwo />} />
      <ToolbarAlign type='left' icon={<FormatAlignLeft />}/>
      <ToolbarAlign type='center' icon={<FormatAlignCenter />}/>
      <ToolbarAlign type='right' icon={<FormatAlignRight />}/>
      <ToolbarList typeList={'ul'} icon={<FormatListBulleted />}  />
      <ToolbarList typeList={'ol'} icon={<FormatListNumbered />}  />
      <ToolbarLink icon={<Link />} />
   </HeadingToolbar>
  );  
}

const RichTextEditor = ({html, onUpdate, variant='min' }) => {
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);
  const { body } = new DOMParser().parseFromString(html, 'text/html');
  const plugins = (variant==='min')?pluginsMin:pluginsMax;

  let fragment = deserializeHTMLToDocumentFragment({
    plugins,
    element: body,
  });
  const initialValue = [{
    type: 'paragraph',
    children: fragment,
  }];
  console.log('initialValue', initialValue);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    const html = serializeHTMLFromNodes({ nodes: value, plugins });
    onUpdate(html);
  };

  return (
    <>
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      {(variant==='min'?(<ToolBarMin/>):(<ToolBarMax/>))}
      <EditablePlugins plugins={plugins} placeholder="Enter some text..." />
    </Slate>
    <Button variant="outlined" color="secondary" onClick={handleSave}>Save</Button>
    </>
  )
}

export default RichTextEditor