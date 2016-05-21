'use strict';

const fetchDataFrom = require('./fetchDataFrom');

module.exports = (request, response) => {

  const userName = request.params.userName;
  Promise.all([fetchDataFrom(`https://api.twitch.tv/kraken/streams/${userName}`),fetchDataFrom(`https://api.twitch.tv/kraken/channels/${userName}`)])
        .then((fetchedData) => {
          let streamData = fetchedData[0].stream,
              channelData = fetchedData[1];

          let twitchObj = {
            isStreaming: streamData ? true : false,
            game: streamData ? streamData.game : null,
            preview: streamData ? streamData.preview.large : null,
            status: channelData.status,
            display_name: channelData.display_name,
            logo: channelData.logo || "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png",
            url: channelData.url
          };
          response.send(twitchObj);
        })
        .catch((error) => {
          if(error.statusCode === 404) {
            response.send({
              isStreaming: false,
              game: null,
              preview: null,
              status: "User does not exist",
              display_name: userName,
              logo: "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png",
              url: null
            })
          } else {
            response.send(error);
          }
        })
};
