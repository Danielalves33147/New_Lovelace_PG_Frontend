/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import styles from './YouGlishWidget.module.css';
const YouGlishWidget = () => {
    const [query, setQuery] = useState('');
    const [lang, setLang] = useState('english');
    const [accent, setAccent] = useState('');
    const [widget, setWidget] = useState(null);
    const [views, setViews] = useState(0);
    const [curTrack, setCurTrack] = useState(0);
    const [totalTracks, setTotalTracks] = useState(0);
    const [speed, setSpeed] = useState(1);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://youglish.com/public/emb/widget.js";
        script.async = true;
        document.body.appendChild(script);

        window.onYouglishAPIReady = () => {
            const newWidget = new window.YG.Widget("widget-1", {
                width: 640,
                components: 9,
                events: {
                    'onFetchDone': onFetchDone,
                    'onVideoChange': onVideoChange,
                    'onCaptionConsumed': handleCaptionConsumed
                }
            });
            setWidget(newWidget);
        };

        return () => {
            document.body.removeChild(script);
            delete window.onYouglishAPIReady;
        };
    }, []);

    const onFetchDone = (event) => {
        if (event.totalResult === 0) {
            alert("No result found");
        } else {
            setTotalTracks(event.totalResult);
        }
    };

    const onVideoChange = (event) => {
        setCurTrack(event.trackNumber);
        setViews(0);
    };

    const handleCaptionConsumed = useCallback(() => {
        setViews((prevViews) => {
            const newViews = prevViews + 1;

            if (widget) {
                if (newViews < 3) {
                    widget.replay();
                } else if (curTrack < totalTracks) {
                    widget.next();
                }
            }

            return newViews;
        });
    }, [curTrack, totalTracks, widget]);

    const fetchVideo = () => {
        if (widget) {
            widget.fetch(query, lang, accent);
        }
    };

    const handlePlay = () => {
        if (widget) {
            widget.play();
        }
    };

    const handlePause = () => {
        if (widget) {
            widget.pause();
        }
    };

    const handleNext = () => {
        if (widget) {
            widget.next();
        }
    };

    const handlePrevious = () => {
        if (widget) {
            widget.previous();
        }
    };

    const handleSpeedChange = (newSpeed) => {
        if (widget) {
            widget.setSpeed(newSpeed);
            setSpeed(newSpeed);
        }
    };

    const handleMove = (seconds) => {
        if (widget) {
            widget.move(seconds);
        }
    };

    return (
        <div className={styles.widgetContainer}>
            <h2 className={styles.widgetTitle}>YouGlish Video Widget</h2>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Search query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.inputField}
                />
                <select value={lang} onChange={(e) => setLang(e.target.value)} className={styles.selectField}>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                </select>
                <input
                    type="text"
                    placeholder="Accent (optional)"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className={styles.inputField}
                />
                <button onClick={fetchVideo} className={styles.fetchButton}>Fetch Video</button>
            </div>
            <div className={styles.controls}>
                <button onClick={handlePlay} className={styles.controlButton}>Play</button>
                <button onClick ={handlePause} className={styles.controlButton}>Pause</button>
                <button onClick={handleNext} className={styles.controlButton}>Next </button>
                <button onClick={handlePrevious} className={styles.controlButton}>Previous</button>
                <button onClick={() => handleMove(-5)} className={styles.controlButton}>Rewind 5s</button>
                <button onClick={() => handleMove(5)} className={styles.controlButton}>Forward 5s</button>
                <button onClick={() => handleSpeedChange(1)} className={styles.controlButton}>Normal Speed</button>
                <button onClick={() => handleSpeedChange(1.5)} className={styles.controlButton}>1.5x Speed</button>
                <button onClick={() => handleSpeedChange(2)} className={styles.controlButton}>2x Speed</button>
            </div>
            <div className={styles.infoGroup}>
                <p>Views: {views}</p>
                <p>Speed: {speed}x</p>
            </div>
            <div id="widget-1" />
        </div>
    );
};

export default YouGlishWidget;