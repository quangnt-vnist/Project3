import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';

const TextEditor = (props) => {
    const {edit=true, onChange, data} = props;
    
    if(edit)
        return (
            <CKEditor
                editor={ClassicEditor}
                onChange={onChange}
                data={data}
            />
        );
    else 
        return (
            <React.Fragment>
                {parse(data)}
            </React.Fragment>
        );
}

export {TextEditor};