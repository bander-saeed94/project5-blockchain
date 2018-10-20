/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

var HDWalletProvider = require('truffle-hdwallet-provider')
var mnemonic = "endorse try wreck bless curtain orchard radar know vast chief follow amount";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/3da4a7d697284bda8f8c2855b1f0174f') 
      },
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};


//StarNotary: 0x5f58c06e4109b7d3c48dfcd07e0c7ffcacff96c4
// tx: 0xbbe9a816ddc2eed88610063324568d2fe056656113ee4f494ac1d10fba4870fb


// Token Id: 3
// Star Name: Funs
// Star Owner: 0x0b4ed0d6f38c9fbf3165a7d2a9b252c0f07e223c
//0xa050cdc99ec461899ecea2d60a8edb844f82826957824381618b28f6b40c1c6e

//put token 3 for sale
//0x9cf5a9a9c12f5834a12139849af569cade4a2bee93f08768c2e381f287ace7ea

//been put for sale 



//bought
//https://rinkeby.etherscan.io/tx/0xbbf92d13e93201338add44e23fd930432773cd8b44ffc5f9d3bbbf97b1ea00ba


//Token Id: 1
// Star Name: star
// Star Owner: 0x04ed0d6f38c9fbf3165a7d2a9b252c0f07e223c


//$truffle migrate --reset --compile-all --network rinkeby
// StarNotary: 0x39b3e364bc04c8e276098eb05f45ce0f83dbb80a
// 0x0e79c323cf0f235269679ae49b238a48a1ed4110eabd20b0431dadca5a714e04
// 0x6a5a0e87b56f9037856128ec530201c41d30a822a6c425ee9942cacee4160272 not exacpet
// 0xc5e1541e42838e70a0440aeb5fcc69c5438b271812ac8ca5fb0a4bd74ca7e955

//---------------------------------
//0x9ce4f2719d4b7eaf6bc7da06bc351cad6b9656dd2d6ad4c531fb5a4b524c1bf8
//
//---------------------------------


//---------------------------------
//tx: 0x25c3198f6639acb27e1442c2ec246ee55b26cb22b680d2ca28352068507a34da
//tokenId: 6
//---------------------------------

//
//0x333684ae22a6572342c357c6a3056be02634caf12f9759fe865bdf518495f4eb
//

//
//0x9471ba9cedfe9704798d5fce9851ba3c41b6d9d27be44ca132c2a123f5e51191

// Running migration: 1_initial_migration.js
//   Replacing Migrations...
//   ... 0x4baa019dfc789a9666f4afe47d457aa49688e2280704271806e43dc57ca27239
//   Migrations: 0xf4e13f8b492a5d2e7d58266960e0da9d1ab63338
// Saving successful migration to network...
//   ... 0xc314b955e9344ec055071122aa0007cb2c2336b462b184030d2f2da74895e954
// Saving artifacts...
// Running migration: 2_deploy_contracts.js
//   Replacing StarNotary...
//   ... 0x83b1af26b04974cacaf67f2483c9ef7e5c3f12bfa157409a30b460cdedfbe5b2
//   StarNotary: 0x39b3e364bc04c8e276098eb05f45ce0f83dbb80a
// Saving successful migration to network...
//   ... 0x1ccb27b7779ea





//StarNotary: 0xbcc3d44d684f6a785212c6f75d6004f2b808c2d6
