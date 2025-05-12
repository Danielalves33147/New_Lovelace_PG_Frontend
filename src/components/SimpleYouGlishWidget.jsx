import { useEffect } from 'react';

const SimpleYouGlishWidget = () => {
    useEffect(() => {
        const widgetLink = document.createElement('a');
        widgetLink.id = 'yg-widget-0';
        widgetLink.className = 'youglish-widget';
        widgetLink.setAttribute('data-query', 'great power');
        widgetLink.setAttribute('data-lang', 'english');
        widgetLink.setAttribute('data-accent', 'us');
        widgetLink.setAttribute('data-zones', 'all,us,uk,aus');
        widgetLink.setAttribute('data-components', '8415');
        widgetLink.setAttribute('data-auto-start', '0');
        widgetLink.setAttribute('data-bkg-color', 'theme_light');
        widgetLink.setAttribute('data-rest-mode', '1');
        widgetLink.setAttribute('rel', 'nofollow');
        widgetLink.href = 'https://youglish.com';
        // widgetLink.innerText = 'Visit YouGlish.com';

        document.body.appendChild(widgetLink);

        const script = document.createElement('script');
        script.src = 'https://youglish.com/public/emb/widget.js';
        script.async = true;
        script.charset = 'utf-8';
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(widgetLink);
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            {/* O widget será renderizado no elemento <a> que foi adicionado ao DOM */}
        </div>
    );
};

export default SimpleYouGlishWidget;