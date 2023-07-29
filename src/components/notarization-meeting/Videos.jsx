import { Box, Typography } from '@mui/material';
import { AgoraVideoPlayer } from 'agora-rtc-react';
import React from 'react';
import { Controls } from './Controls';
import { Axios } from '../../configs/AxiosConfig';

export const Videos = props => {
  const {
    users,
    tracks,
    uid,
    token,
    ready,
    start,
    channelName,
    setStart,
    setInCall,
  } = props;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      {uid !== '999' && (
        <Box sx={{ width: '100%', height: '30%' }}>
          <Box
            sx={{
              border: '2px solid white',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
            className="local"
          >
            <AgoraVideoPlayer
              id={`user-video${uid}`}
              style={{ height: '100%', width: '100%' }}
              videoTrack={tracks[1]}
            />
            <Typography
              sx={{
                position: 'absolute',
                top: '1px',
                right: '1px',
                color: 'black',
                opacity: '0.75',
                backgroundColor: 'white',
                padding: '2px',
                borderRadius: '5px',
              }}
            >
              {uid}
            </Typography>
            {ready && tracks && uid === 'notary' && (
              <Box sx={{ position: 'absolute', bottom: '0px', right: '0px' }}>
                <Controls
                  uid={uid}
                  token={token}
                  channelName={channelName}
                  tracks={tracks}
                  start={start}
                  setStart={setStart}
                  setInCall={setInCall}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          border: '2px solid white',
          height: '30%',
          width: '100%',
        }}
      >
        {users.length > 0 &&
          users.map(user => {
            if (user.uid === '999') return null;
            if (user.videoTrack) {
              return (
                <Box
                  sx={{ position: 'relative', width: '100%', height: '100%' }}
                >
                  <AgoraVideoPlayer
                    id={`user-video${user.uid}`}
                    style={{ height: '100%', width: '100%' }}
                    className="vid"
                    videoTrack={user.videoTrack}
                    key={user.uid}
                  />
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: '1px',
                      right: '1px',
                      color: 'black',
                      opacity: '0.75',
                      backgroundColor: 'rgb(255 255 255 / 50%)',
                      padding: '2px',
                      borderRadius: '5px',
                    }}
                  >
                    {user.uid}
                  </Typography>
                  <Box
                    sx={{ position: 'absolute', bottom: '0px', right: '0px' }}
                  >
                    {uid === 'notary' && (
                      <Controls
                        uid={user.uid}
                        type="signee"
                        channelName={channelName}
                      />
                    )}
                  </Box>
                </Box>
              );
            } else return null;
          })}
      </Box>
      {/* <Box>
        <Button onClick={startRecording}>Record</Button>
      </Box> */}
    </Box>
  );
};
