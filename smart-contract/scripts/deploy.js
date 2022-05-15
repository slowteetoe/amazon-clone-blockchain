async function main() {
    // We get the contract to deploy
    const AmazonCoin = await ethers.getContractFactory("AmazonCoin");
    const ac = await AmazonCoin.deploy();
  
    await ac.deployed();
  
    console.log("AmazonCoin deployed to:", ac.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });