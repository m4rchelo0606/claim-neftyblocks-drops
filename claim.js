const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const { PrivateKey } = require('eosjs/dist/PrivateKey');
const { base64ToBinary } = require('eosjs/dist/eosjs-numeric');
const { TextEncoder, TextDecoder } = require('util');
const fetch = require('node-fetch');
const chainId = '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4';
const util = require('util')
const base64Abi = require('./abi.json');



//...........................................................

const privateKey=  '';   // приватный ключ
const accountPublicKey = PrivateKey.fromString(privateKey).getPublicKey().toString();
const signatureProvider = new JsSignatureProvider([privateKey]);
const url='https://wax.pink.gg'       //url эндпоинта можно не менять


data=[ //action      имя акка     не меняем      номер дропа  количество    ид нфт которое храните  
 {name:'claimwproof',actor:'',permission:'owner', drop_id:92460, amount:1,  asset_ids:[]},
 {name:'claimwproof',actor:'',permission:'owner', drop_id:92462, amount:1,  asset_ids:[]},
 {name:'claimwproof',actor:'',permission:'owner', drop_id:92459, amount:1,  asset_ids:[]},
 {name:'claimwproof',actor:'',permission:'owner', drop_id:92456, amount:1,  asset_ids:[]}
 ]
 




saletime =1642618800000    // время дропа
howearly = 1100            // насколько раньше времени отправить транзу (мс)

//............................................................

const authorityProvider = {
  getRequiredKeys: async (args) => [accountPublicKey]
};
const abiProvider = {
  getRawAbi: async (accountName) => {
    return { abi: base64ToBinary(base64Abi.abi), accountName };
  },
};
const rpc = new JsonRpc(url, {fetch});
const api = new Api({
  rpc,
  signatureProvider,
  authorityProvider,
  abiProvider,
  chainId,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});
const arrayToHex = (data) => {
  let result = '';
  for (const x of data) {
    result += ('00' + x.toString(16)).slice(-2);
  }
  return result;
};



async function gen_trx(data) {
  block_num = (await rpc.get_info()).last_irreversible_block_num
  ref_block_num = block_num & 0xFFFF
  ref_block_prefix= (await rpc.get_block(block_num)).ref_block_prefix
  const res = await api.transact({
    ref_block_num : ref_block_num ,
    ref_block_prefix : ref_block_prefix,
    expiration: (new Date(Date.now() + (new Date()).getTimezoneOffset() * 60000 + 500000)),  // 30 second tx expiry
    actions: [{
      account: "neftyblocksd",
      name: data.name,
      authorization: [{
        actor: data.actor,
        permission: data.permission,
      }],
      data: {
       claimer: data.actor,
       drop_id: data.drop_id,
       amount: data.amount,
       asset_ids:data.asset_ids,
       intended_delphi_median: 0,
       referrer:"NeftyBlocks",
       country:"RU",
       currency:"8,WAX"
      },
    }]    
  }, {
    broadcast: false,
    sign: true,
  })

trx = {signatures: await res.signatures, compression: false, packed_context_free_data: arrayToHex(new Uint8Array(0)), packed_trx: arrayToHex(res.serializedTransaction)}

return JSON.stringify(trx)
}
  

async function push_trx(url,transaction){
  console.log('time',Date.now())
  await fetch(url+'/v1/chain/push_transaction', {
  method: 'POST',
  body: transaction,
  headers: { 'Content-Type': 'application/json' }
}).then(res => res.json())
.then(json => console.log(util.inspect(json, {showHidden: false, depth: null, colors: true}))
)
}
  


  
  
  
  
async function run(){
 trx_1=await gen_trx(data[0])
 trx_2=await gen_trx(data[1])
 trx_3=await gen_trx(data[2])
  trx_4=await gen_trx(data[3])
  tasks=[]
  tasks.push(push_trx(url,await trx_1),push_trx(url,await trx_2),push_trx(url,await trx_3),push_trx(url,await trx_4))

  while (true) {
  var now = Date.now()
  console.log(Date.now())
   if (now>=saletime-howearly){
   console.log(Date.now())
   Promise.all(tasks)
   break }
    
   }
  
}

 



 run()


