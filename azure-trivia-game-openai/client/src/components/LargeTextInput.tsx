import React from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './App.css';

type Props = {  
    text: string;  
    setText: React.Dispatch<React.SetStateAction<string>>;  
  }; 

  const LargeTextInput: React.FC<Props> = ({ text, setText }) => {  
    const handleEditorChange = (editorState: EditorState) => {  
      const contentState = editorState.getCurrentContent();  
      const rawContentState = convertToRaw(contentState);  
      const text = JSON.stringify(rawContentState);  
      setText(text);  
    };  
    
    const rawContentState = JSON.parse(text);  
    const contentState = EditorState.createWithContent(rawContentState);  
    
    return (  
      <div>  
        <Editor  
          editorState={contentState}  
          onEditorStateChange={handleEditorChange}  
        />  
      </div>  
    );  
  };  
    
  export default LargeTextInput; 