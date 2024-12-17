import React from 'react';
import { WebView } from 'react-native-webview';
import { OpenWebUIReact } from '@open-webui/react'
import { Image, SvgXml } from 'react-native';

const App = () => {
  return (
    <WebView
      source={{ 
        uri: 'http://100.101.99.38:8080/',
        headers: {
          'Cache-Control': 'no-cache'
        }
      }}
      originWhitelist={['*', 'http://*', 'https://*']}
      mixedContentMode="always"
      allowsInlineMediaPlayback={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      thirdPartyCookiesEnabled={true}
      sharedCookiesEnabled={true}
      onShouldStartLoadWithRequest={(request) => {
        return true;
      }}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
    />
  );
};

const menuIconXml = `
  <svg width="24" height="24" viewBox="0 0 24 24">
    <!-- ваш SVG код -->
  </svg>
`;

const MenuIcon = () => <SvgXml xml={menuIconXml} width="24" height="24" />;

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <OpenWebUIReact>
      <App />
    </OpenWebUIReact>
  </React.StrictMode>
) 