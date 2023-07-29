import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const config = {
  mode: "rtc",
  codec: "vp8",
};

export const appId = "b135b1742dc24e738371f11a54308b1b";
export const token =
  "007eJxTYChYv2PrMq9Io5qSmJ0WW+Nfx3KdvtIQmvN/Oeu89ph/pQcUGJKSTE3SDA2Sk5NN0kyMTA0tzQ2AIDXJxCzFONXCKDXca2JKQyAjg+z/hSyMDBAI4rMw5CZm5jEwAACoeyCB";

// the create methods in the wrapper return a hook
// the create method should be called outside the parent component
// this hook can be used the get the client/stream in any component
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();