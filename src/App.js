import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { bollingerBands, bollingerBandsWidth } from 'indicatorts';
import usdt from "./symbolUsdt.json"

const App = () => {
  const number = 15
  const [coin, setcoin] = useState([])
  useEffect(() => {
    for (let index = 0; index < usdt.length; index++) {
      axios.get(`https://api.binance.com/api/v3/klines?symbol=${usdt[index]}&interval=1d`)
        .then(function (response) {
          // handle success
          const closings = response.data.map((i) => Number(i[4]));
          const resultBol = bollingerBands(closings);
          const resultBolWei = bollingerBandsWidth(resultBol);
          const resultBolWeiLastElement = resultBolWei.bandWidth.slice(-1)
          const resultBolWeiAve = resultBolWei.bandWidth.slice(-number).reduce((total, element) => total + element) / number

          if (resultBolWeiLastElement[0] < resultBolWeiAve && resultBolWeiAve < 0.25) {
            setcoin(s => [...s, usdt[index]])
            console.log(usdt[index])
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }, [])

  const getcoin = (name) => {
    const coinname = name;
    let myArray = coinname.split("USDT");
    const findEmpty = myArray.findIndex((i) => i === "")
    myArray[findEmpty] = "USDT"
    console.log(myArray)
    window.open(`https://www.binance.com/tr/trade/${myArray[0]}_${myArray[1]}`, "_blank");
  }

  return (
    <>
      <div className='grid'>
        {coin.map((i, id) => (
          <div onClick={() => getcoin(i)} className='coin' key={id}>{i}</div>
        ))}
      </div>
    </>
  )
}

export default App