/*==================================================
  Modules
  ==================================================*/

  const sdk = require('@defillama/sdk');
  const BigNumber = require('bignumber.js');
  const _ = require('underscore');

/*==================================================
  Addresses
  ==================================================*/

  // const xNRV = "0x15B9462d4Eb94222a7506Bc7A25FB27a2359291e"
  const threeNRV = "0x1B3771a66ee31180906972580adE9b81AFc5fCDc"
  // const nrvBTC = "0xD1D5Af92C606C6F2eC59D453f57A6FCc188D7dB5"
  // const nrvETH = "0x0d283BF16A9bdE49cfC48d8dc050AF28b71bdD90"

  const tokens = {
  	// NRV
  	// "0x42f6f551ae042cbe50c739158b4f0cac0edb9096": [xNRV],
  	// BUSD
  	"0xe9e7cea3dedca5984780bafc599bd69add087d56": [threeNRV],
  	// USDC
  	"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d": [threeNRV],
  	// USDT
  	"0x55d398326f99059ff775485246999027b3197955": [threeNRV],
  	// anyBTC
  	// "0x54261774905f3e6e9718f2abb10ed6555cae308a": [nrvBTC],
  	// anyETH
  	// "0x6f817a0ce8f7640add3bc0c1c2298635043c2423": [nrvETH],
  }

/*==================================================
  TVL
  ==================================================*/

	let balances = {};
    let calls = [];
    
    for (const token in tokens) {
      for(const poolAddress of tokens[token])
      calls.push({
        target: token,
        params: poolAddress
      })
    }

	const ZERO = new BigNumber(0)
	const ETHER = new BigNumber(10).pow(18)

	async function tvl(timestamp) {
	const { block } = await sdk.api.util.lookupBlock(timestamp, {
	    chain: 'bsc'
	})
	const balanceOfResults = (await sdk.api.abi.multiCall({
	    calls: calls,
	    abi: 'erc20:balanceOf',
	    chain: 'bsc'
	}))

	_.each(balanceOfResults.output, (balanceOf) => {
	  if(balanceOf.success) {
	    let address = balanceOf.input.target
	    balances['bsc:' + address] = BigNumber(balances[address] || 0).plus(balanceOf.output).toFixed()
	  }
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
