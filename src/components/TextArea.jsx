/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';
import styles from './TextArea.module.css'

function TextArea({ name, placeholder, value, handleOnChange, required }) {
    const textareaRef = useRef(null);

    function autoResize() {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        const maxHeight = 1000 * 10;
        if (textarea.scrollHeight > maxHeight) {
            textarea.style.height = maxHeight + 'px';
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.height = textarea.scrollHeight + 'px';
            textarea.style.overflowY = 'hidden';
        }
    }

    useEffect(() => {
        autoResize();
    }, [value]);

    return (
        <>
            <textarea className={styles.textarea}
                ref={textareaRef}
                name={name}
                id={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    handleOnChange(e);
                    autoResize();
                }}
                required={required}
                rows="1"
            />
        </>
    );
}

export default TextArea;
