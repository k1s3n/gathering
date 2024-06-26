// WidgetBotComponent.js
import React from 'react';
import WidgetBot from '@widgetbot/react-embed';

const WidgetBotComponent = () => {
  const onAPI = (api) => {
    api.on('signIn', (user) => {
      console.log(`User signed in as ${user.username}`, user);
    });
  };

  return (
    <WidgetBot
      server="1254855470951436348"
      channel="1255571455194959872"
      width="350"
      height="400"
      onAPI={onAPI}
    />
  );
};

export default WidgetBotComponent;
