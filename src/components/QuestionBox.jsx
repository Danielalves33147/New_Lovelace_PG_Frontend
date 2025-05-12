/* eslint-disable react/prop-types */
import TextArea from './TextArea';
import styles from './QuestionBox.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

function QuestionBox({ id, text, handleQuestionChange, handleRemove}) {
    const handleTextChange = (e) => {
        handleQuestionChange(id, 'text', e.target.value);
    };

    const remove=(e)=>{
        e.preventDefault()
        handleRemove(id)
    }

    return (
        <div className={styles.question_box}>
            <TextArea
                name="question"
                placeholder="Pergunta"
                value={text}
                handleOnChange={handleTextChange}
                required={true}
            />
            <button className={styles.button_trash} onClick={remove}>
                <FontAwesomeIcon className={styles.trash} icon={faTrash} />
            </button>
        </div>
    );
}

export default QuestionBox;
