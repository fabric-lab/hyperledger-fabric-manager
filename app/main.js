import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';
import { addLocaleData,IntlProvider } from 'react-intl'; 
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zh_CN from './message/zh_CN';
import en_US from './message/en_US';


let history = createBrowserHistory();
let locale   = "en"
let messages = en_US
addLocaleData([...en, ...zh]);
if(window.location.href.indexOf("zh_CN")!=-1){
     locale   = "zh"
     messages = zh_CN
}

ReactDOM.render( <IntlProvider locale={locale} messages={messages}><HashRouter>{routes}</HashRouter></IntlProvider>, document.getElementById('app'));