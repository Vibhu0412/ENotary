import CameraIcon from '@mui/icons-material/Camera';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box, Button, Modal } from '@mui/material';
import html2canvas from 'html2canvas';
import React, { useState } from 'react';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useClient } from '../../configs/AgoraConfig';
import { Axios } from '../../configs/AxiosConfig';

export const Controls = props => {
  const imgRef = React.useRef(null);
  const [snap, setSnap] = useState(false);
  const [recording, setRecording] = useState(false);
  const client = useClient();
  const { tracks, setStart, setInCall, uid, type, channelName } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const mute = async type => {
    if (type === 'audio') {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState(ps => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === 'video') {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState(ps => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    // we close the tracks to perform cleanup

    tracks[1].close();
    tracks[0].close();
    setStart(false);
    setInCall(false);
  };

  const snapMyPhoto = async uid => {
    setSnap(true);
    const divElement = document.getElementById(`user-video${uid}`);
    if (!divElement) return;

    html2canvas(divElement).then(canvas => {
      const image = canvas.toDataURL('image/png');

      imgRef.current.src = image;

      // // Save the image (optional)
      // const link = document.createElement("img");
      // link.href = image;
      // link.download = "div_image.png";
      // link.click();
    });
  };

  const saveHandle = () => {
    const link = document.createElement('a');
    link.href = imgRef.current.src;
    link.download = 'div_image.png';
    link.click();
    setSnap(false);
  };

  const startRecording = async () => {
    try {
      const { data } = await Axios.post('/recording/start', { channelName });
      localStorage.setItem('recording', JSON.stringify(data));
      setRecording(true);
    } catch (error) {}
  };

  const stopRecording = async () => {
    try {
      const recording = JSON.parse(localStorage.getItem('recording'));
      const { data } = await Axios.post('/recording/stop', {
        sid: recording.sid,
        resourceId: recording.resourceId,
        channelName: channelName,
      });
      if (data) {
        localStorage.removeItem('recording');
        setRecording(false);
      }
    } catch (error) {}
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      {type !== 'signee' ? (
        <>
          {/* <Button className="control-button" onClick={() => mute("audio")}>
            {trackState.audio ? <MicOffIcon /> : <MicIcon />}
          </Button>

          <Button onClick={() => mute("video")}>
            {trackState.video ? <VideocamOffIcon /> : <VideocamIcon />}
          </Button> */}
          <Button onClick={() => leaveChannel()}>
            <LogoutIcon />
          </Button>
          {/* <Button onClick={startRecording}>
            <RadioButtonCheckedIcon />
          </Button>
          <Button onClick={stopRecording}>
            <RadioButtonUncheckedIcon />
          </Button> */}
        </>
      ) : null}
      <Button onClick={() => snapMyPhoto(uid)}>
        <CameraIcon />
      </Button>
      <Modal
        open={snap}
        onClose={() => setSnap(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 0.5,
            borderRadius: '4px',
          }}
        >
          <img
            style={{ width: '100%', objectFit: 'cover', borderRadius: '4px' }}
            ref={imgRef}
            alt="img"
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 15px',
            }}
          >
            <Button onClick={() => setSnap(false)}>Take another</Button>
            <Button onClick={saveHandle}>Download</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
