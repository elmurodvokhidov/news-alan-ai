import React, { useEffect, useState } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from './components/newsCards/NewsCards';
import useStyles from './AppStyles.js';
import wordsToNumbers from 'words-to-numbers';

const alanKey = '9ed2a9d19cb83b85afa662e895cd92152e956eca572e1d8b807a3e2338fdd0dc/stage';

function App() {
    const [newsArticles, setNewsArticles] = useState([]);
    const classes = useStyles();
    const [activeArticle, setActiveArticle] = useState(-1);

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                    setNewsArticles(articles);
                    setActiveArticle(-1);
                }
                else if (command === 'highlight') {
                    setActiveArticle((prev) => prev + 1);
                }
                else if (command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];

                    if (parsedNumber > 20) {
                        alanBtn().playText('Please try that again');
                    }
                    else if (article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...')
                    }
                }
            }
        })
    }, []);

    return (
        <div>
            <div className={classes.logoContainer}>
                <img className={classes.alanLogo} src="https://alan.app/alan-brand-images/logo-horizontal/color/alan-logo-horizontal-color.png" alt="alan logo" />
            </div>
            <NewsCards newsArticles={newsArticles} activeArticle={activeArticle} />
        </div>
    );
}

export default App;