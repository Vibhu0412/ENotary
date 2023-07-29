import { Box } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";
import MeetingVideoCall from "../components/notarization-meeting/MeetingVideoCall";
import MeetingPdfWebViewer from "../components/notarization-meeting/MeetingPdfWebViewer";

const Meeting = () => {
  const [searchParams] = useSearchParams();
  
  return (
    <Box sx={{ display: "flex", maxWidth: "100vw" }}>
      <Box sx={{ flex: 3 }}>
        <MeetingPdfWebViewer quid={searchParams.get("uid")} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <MeetingVideoCall
          qchannelName={searchParams.get("channelName")}
          quid={searchParams.get("uid")}
        />
      </Box>
    </Box>
  );
};

export default Meeting;
