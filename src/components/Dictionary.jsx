import { useState } from 'react';
import styles from './Dictionary.module.css';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dictionary = () => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const fetchDefinition = async () => {
    if (!word) {
      setError('Por favor, insira uma palavra.');
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
        throw new Error('Palavra não encontrada.');
      }
      const data = await response.json();
      setDefinition(data[0]); 
      setError(''); 
      setIsModalOpen(true); 
    } catch (err) {
      setError(err.message); 
      setDefinition(null); 
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDefinition(null);
  };

  return (
    <div className={styles.container}>
      <h1>Dicionário</h1>
      <div className={styles.search}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Digite uma palavra"
        />
        <button onClick={fetchDefinition}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            {definition && (
              <div className={styles.definition}>
                <h2>Definição de {definition.word}</h2>
                <p><strong>Fonética:</strong> {definition.phonetic}</p>
                <p><strong>Origem:</strong> {definition.origin}</p>
                {definition.meanings.map((meaning, index) => (
                  <div key={index} className={styles.meaning}>
                    <h3>{meaning.partOfSpeech}</h3>
                    {meaning.definitions.map((def, idx) => (
                      <div key={idx}>
                        <p><strong>Definição:</strong> {def.definition}</p>
                        {def.example && <p className={styles.exemplo}><strong>Exemplo:</strong> {def.example}</p>}
                      </div>
                    ))}
                  </div>
                ))}
                {definition.phonetics.map((phonetic, index) => (
                  phonetic.audio && (
                    <audio key={index} controls className={styles.audio}>
                      <source src={phonetic.audio} type="audio/mpeg" />
                      Seu navegador não suporta o elemento de áudio.
                    </audio>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dictionary;