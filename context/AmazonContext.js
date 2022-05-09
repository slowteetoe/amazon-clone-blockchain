import { createContext, useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";

export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");

  const {
    authenticate,
    isAuthenticated,
    enableWeb3,
    Moralis,
    user,
    isWeb3Enabled,
  } = useMoralis()

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const currentUsername = await user?.get("nickname");
        setUsername(currentUsername);
      } else {
          console.log('not authenticated')
      }
    })();
  }, [isAuthenticated, authenticate, setUsername, user, username, isWeb3Enabled, enableWeb3]);

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

  return (
    <AmazonContext.Provider
      value={{
        isAuthenticated,
        nickname,
        setNickname,
        username,
        setUsername,
        handleSetUsername,
      }}
    >
      {children}
    </AmazonContext.Provider>
  );
};
