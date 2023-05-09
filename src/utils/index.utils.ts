// eslint-disable-next-line @typescript-eslint/no-var-requires
const twilio = require('twilio');

const AccessToken = twilio.jwt.AccessToken;
const { VideoGrant } = AccessToken;

const generateToken = (identity: string) => {
  return new AccessToken(
    'ACc1c1b5bcd3596df5fd128cb030f0f422',
    'SK151888ec342be72334825fee2f7763ab',
    'emBIfripCtwciPcA490R1oKIZxw9fVYR',
    { identity },
  );
};

export const getVideoToken = (room: any, identity: string) => {
  let videoGrant: any;
  if (typeof room !== 'undefined') {
    videoGrant = new VideoGrant({ room });
    console.log(
      '🚀 ~ file: index.utils.ts:20 ~ getVideoToken ~ videoGrant:',
      videoGrant,
    );
  } else {
    videoGrant = new VideoGrant();
    console.log(
      '🚀 ~ file: index.utils.ts:26 ~ getVideoToken ~ videoGrant:',
      videoGrant,
    );
  }
  const token = generateToken(identity);
  token.addGrant(videoGrant);
  // token.identity = identity;
  return token;
};
