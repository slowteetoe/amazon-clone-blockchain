import React, { useState, useContext } from "react";
import { AmazonContext } from "../context/AmazonContext";
import Card from "./Card";

const Cards = () => {
  const styles = {
    container: `h-full w-full flex flex-col ml-[20px] -mt-[50px]`,
    title: `text-xl font-bolder mb-[20px] mt-[30px]  ml-[30px]`,
    cards: `flex items-center  flex-wrap gap-[80px]`,
  };
  const { assets } = useContext(AmazonContext);

  const item = {
    id: 1,
    attributes: {
      name: "foo",
      price: 2,
      src: "https://media2.giphy.com/media/cczZn3x7985TzzrVqp/200w.webp?cid=ecf05e47py36g0m2coccizijeuwjp3pv2q3fcqqn23gslcie&rid=200w.webp&ct=g",
    },
  };
  console.log(assets);
  return (
    <div className={styles.container}>
      <div className={styles.title}>New Release</div>
      <div className={styles.cards}>
        {assets.map((item) => {
          return <Card key={item.id} item={item.attributes} />
        })}
      </div>
    </div>
  );
};

export default Cards;
