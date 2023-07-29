import React, { useState } from 'react';
import { VideoCall } from './VideoCall';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../../configs/AgoraConfig';
import useSkin from '@/hooks/useSkin';
import Icon from '@/components/ui/Icon';

function MeetingVideoCall({ qchannelName, quid, qtoken }) {
  const client = useClient();
  const [skin] = useSkin();
  const [startRecording, setStartRecording] = useState(false);
  const [inCall, setInCall] = useState(qchannelName && quid);
  const [channelName, _setChannelName] = useState(qchannelName ?? '');
  const [uid, _setUid] = useState(quid ?? '');
  const navigate = useNavigate();
  return (
    <div>
      {inCall && (
        <>
          {uid == 'notary' && (
            <div className="flex flex-row">
              <div
                className={`rounded-md m-2 ${
                  skin === 'bordered'
                    ? ' border border-gray-5002 dark:border-slate-700'
                    : 'shadow-base'
                } `}
                style={{
                  width: '40px',
                  color: startRecording ? 'red' : 'gray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon="carbon:recording-filled" />
              </div>
              <Button
                className="m-2 btn-primary block-btn"
                onClick={() => {
                  setStartRecording(!startRecording);
                }}
              >
                Start Recording
              </Button>
              <Button
                className="m-2 btn-primary block-btn"
                onClick={() => {
                  navigate('/notary/appointment');
                }}
              >
                End Meeting
              </Button>
            </div>
          )}

          <VideoCall
            setInCall={setInCall}
            channelName={channelName}
            uid={uid}
          />
        </>
      )}
    </div>
  );
}

export default MeetingVideoCall;
