import { createContext, useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";

export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [assets, setAssets] = useState([]);

  const {
    authenticate,
    isAuthenticated,
    enableWeb3,
    Moralis,
    user,
    isWeb3Enabled,
  } = useMoralis();

  const {
    data: assetsData,
    error: assetsDataError,
    isLoading: userDataIsLoading,
  } = useMoralisQuery("assets");

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const currentUsername = await user?.get("nickname");
        setUsername(currentUsername);
      } else {
        console.log("not authenticated");
      }
    })();
  }, [
    isAuthenticated,
    authenticate,
    setUsername,
    user,
    username,
    isWeb3Enabled,
    enableWeb3,
  ]);

  useEffect(() => {
    (async () => {
      if (isWeb3Enabled) {
        await getAssets();
      }
    })();
  }, [isWeb3Enabled, assetsData]);

  const handleSetUsername = () => {
    if (!user) {
      console.log("no user");
      return;
    }

    if (!nickname) {
      console.log("can't set empty nickname");
      return;
    }

    user.set("nickname", nickname);
    user.save();
    setNickname("");
    setUsername(nickname);
  };

  const getAssets = async () => {
    try {
      await enableWeb3();
      console.log("running");
      setAssets(assetsData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AmazonContext.Provider
      value={{
        isAuthenticated,
        nickname,
        setNickname,
        username,
        setUsername,
        handleSetUsername,
        assets
      }}
    >
      {children}
    </AmazonContext.Provider>
  );
};
