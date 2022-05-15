import { createContext, useState, useEffect } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { amazonAbi, amazonCoinAddress } from "../lib/constants";

export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState("");
  const [assets, setAssets] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [etherscanLink, setEtherscanLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState("");

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
        await getBalance();
        const currentUsername = await user?.get("nickname");
        setUsername(currentUsername);
        const account = await user?.get("ethAddress");
        setCurrentAccount(account);
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
    currentAccount,
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

  const getBalance = async () => {
    try {
      if (!isAuthenticated || !currentAccount) {
        return;
      }
      let options = {
        contractAddress: amazonCoinAddress,
        functionName: "balanceOf",
        abi: amazonAbi,
        params: {
          account: currentAccount,
        },
      };
      if (isWeb3Enabled) {
        const response = await Moralis.executeFunction(options);
        setBalance(response.toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyTokens = async () => {
    if (!isAuthenticated) {
      await authenticate();
    }

    const amount = ethers.BigNumber.from(tokenAmount);
    const price = ethers.BigNumber.from("100000000000000");
    const calcPrice = amount.mul(price);

    let options = {
      contractAddress: amazonCoinAddress,
      functionName: "mint",
      abi: amazonAbi,
      msgValue: calcPrice,
      params: {
        amount,
      },
    };
    console.log(amazonCoinAddress)

    const transaction = await Moralis.executeFunction(options);
    const receipt = await transaction.wait(4);
    setIsLoading(false);
    console.log(receipt);
    setEtherscanLink(
      `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`
    );
  };

  const getAssets = async () => {
    try {
      await enableWeb3();
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
        assets,
        balance,
        getBalance,
        tokenAmount,
        setTokenAmount,
        amountDue,
        setAmountDue,
        isLoading,
        setIsLoading,
        etherscanLink,
        setEtherscanLink,
        currentAccount,
        buyTokens,
      }}
    >
      {children}
    </AmazonContext.Provider>
  );
};
