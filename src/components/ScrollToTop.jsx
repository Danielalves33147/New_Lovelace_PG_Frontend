import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation(); // Captura a localização atual (rota)

    useEffect(() => {
        window.scrollTo(0, 0); // Rolagem para o topo da página
    }, [pathname]); // Sempre que a rota mudar, execute o scroll para o topo

    return null; // Este componente não precisa renderizar nada
};

export default ScrollToTop;
