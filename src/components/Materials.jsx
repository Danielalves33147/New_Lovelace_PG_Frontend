import styles from './Materials.module.css';
import SimpleYouGlishWidget from './SimpleYouGlishWidget';

const Materials = () => {
    return (
        <section className={styles.materialsSection}>
            <div className={styles.materialBlock}>
            <a id="yg-widget-0" className="youglish-widget" data-query="great%20power" data-lang="english" data-accent="us" data-zones="all,us,uk,aus" data-components="8415" width="300" height="500" data-auto-start="0" data-bkg-color="theme_light" data-rest-mode="1"  rel="nofollow" href="https://youglish.com"></a>
               <SimpleYouGlishWidget/>
            </div>
            <div className={styles.materialBlock}>
                <p>O <a href="https://english-e-reader.net/" target='_blank'>English e-Reader</a> é uma ferramenta interativa que ajuda a melhorar as habilidades de leitura em inglês, oferecendo uma biblioteca diversificada de textos adaptados a diferentes níveis de proficiência. Com recursos que permitem interagir com o conteúdo e monitorar o progresso, é ideal para quem deseja aprimorar a leitura de forma prática e acessível.</p>
                <a href="https://english-e-reader.net/" target='_blank'><img src="/src/img/eReader.png" alt="English e-Reader" /></a>
            </div>
        </section>
    );
};

export default Materials;