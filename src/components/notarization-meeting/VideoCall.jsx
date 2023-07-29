import React, { useEffect, useState } from "react";
import {
  useMicrophoneAndCameraTracks,
  useClient,
  appId,
} from "../../configs/AgoraConfig";
import { Videos } from "./Videos";
import { Box } from "@mui/material";
import { Axios } from "../../configs/AxiosConfig";
import { useNavigate } from "react-router-dom";

export const VideoCall = (props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const { setInCall, channelName, uid } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  // using the hook to get access to the client object
  const client = useClient();
  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name, uid) => {
      client.on("user-published", async (user, mediaType) => {
        if (user.uid === "999") return;
        await client.subscribe(user, mediaType);
        // console.log("subscribe success");
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        // console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", async (user) => {
        // console.log("leaving", user);
        if (user.uid === "notary") {
          await client.leave();
          client.removeAllListeners();
          tracks[1].close();
          tracks[0].close();
          setStart(false);
          setInCall(false);
          navigate("/page-route");
          alert("close the meeting for all");
        }
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      const { data } = await Axios.get(`rtc/${name}/publisher/${uid}`);
      if (!data.rtcToken) {
        window.alert("Some thing went wrong, please try again later");
      }

      setToken(data.rtcToken);

      await client.join(appId, name, data.rtcToken, uid);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      // console.log("init ready");
      init(channelName, uid);
    }
  }, [channelName, client, ready, tracks, uid]);

  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {start && tracks && (
        <Videos
          ready={ready}
          uid={uid}
          token={token}
          channelName={channelName}
          start={start}
          setStart={setStart}
          setInCall={setInCall}
          users={users}
          tracks={tracks}
        />
      )}
    </Box>
  );
};
