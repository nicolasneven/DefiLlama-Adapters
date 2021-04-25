/*==================================================
  Modules
  ==================================================*/

const sdk = require('@defillama/sdk');
const BigNumber = require('bignumber.js');
// const _ = require('underscore');
const axios = require("axios");

/*==================================================
  Addresses
  ==================================================*/

/*
// const xNRV = 
const threeNRV = "0x1B3771a66ee31180906972580adE9b81AFc5fCDc"
// const nrvBTC = 
// const nrvETH = 

const tokens = {
	// NRV
	// "0x42f6f551ae042cbe50c739158b4f0cac0edb9096"
	// BUSD
	"0xe9e7cea3dedca5984780bafc599bd69add087d56": [threeNRV],
	// USDC
	"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d": [threeNRV],
	// USDT
	"0x55d398326f99059ff775485246999027b3197955": [threeNRV],
}
*/

/*==================================================
  TVL
  ==================================================*/

let balances = {};

/*
let calls = [];
for (const token in tokens) {
  for(const poolAddress of tokens[token])
  calls.push({
    target: token,
    params: poolAddress
  });
}
*/

async function tvl(timestamp) {
	/*
	const { block } = await sdk.api.util.lookupBlock(timestamp, {
	  chain: 'bsc'
	});

	const balanceOfResults = (await sdk.api.abi.multiCall({
	  calls: calls,
	  abi: 'erc20:balanceOf',
	  chain: 'bsc'
	}));

	_.each(balanceOfResults.output, (balanceOf) => {
	  if(balanceOf.success) {
	    let address = balanceOf.input.target
	    balances['bsc:' + address] = BigNumber(balances[address] || 0).plus(balanceOf.output).toFixed()
	  }
	});
	*/

	// use BUSD stable as total sum denomination 
	const address = 'bsc:0xe9e7cea3dedca5984780bafc599bd69add087d56';
	// CoinGecko API
	const data = await axios.get('https://api.coingecko.com/api/v3/coins/nerve-finance')
  	  .then((response) => {
  		  const tvl = BigNumber(response.data['market_data']['total_value_locked']['usd']);
  		  // return value expects 18 decimals
		  balances[address] = tvl.shiftedBy(18);
  	});

	return balances;
}

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Nerve',   // project name
    website: 'https://nerve.fi/',
    token: 'NRV',             // null, or token symbol if project has a custom token
    category: 'dexes',        // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1614556800,        // March 1, 2021 00:00 AM (UTC)
    tvl                       // tvl adapter
  }
