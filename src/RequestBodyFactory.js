import { PaymailClient, Verifi } from '@moneybutton/paymail-client'
import fetch from 'isomorphic-fetch'
import dns from 'dns'
import bsv from 'bsv'

const client = new PaymailClient(dns, fetch) // Any implementation of fetch can be used.
const somePaymailAddress = 'some_name@moneybutton.com'
client.getPublicKey(somePaymailAddress).then(pubkey => {
  console.log(`Current public key for ${somePaymailAddress} is ${pubkey}`)
})

// You can look for someones public identity key.
const senderPrivateKey = '1GXntBmLPFj5cFePocrSEvYyfyH9gsT8gi'
client.getOutputFor(somePaymailAddress, {
    senderHandle: '39708@moneybutton.com',
    amount: 10000000, // Amount in satoshis
    senderName: 'Daud',
    purpose: 'Pay for your services.',
    pubkey: '2f63ebf3a3b18c988ca8f7da4ddee7ac'
}, senderPrivateKey).then( output => {
  console.log(`Now I can send money to ${somePaymailAddress} using this output: ${output}`)
})

// You can also use a previously created signature instead of passing in the private key.
import { VerifiableMessage } from '@moneybutton/paymail-client'

const timestamp = new Date().toISOString()
const preMadeSignature = VerifiableMessage.forBasicAddressResolution({
  senderHandle: '39708@moneybutton.com',
  amount: 10000000,
  dt: timestamp,
  purpose: 'Pay for your services.'
}).sign('senderPrivateKey')

client.getOutputFor(somePaymailAddress, {
  senderHandle: '39708@moneybutton.com',
  amount: 10000000, // Amount in satoshis
  senderName: 'Daud',
  purpose: 'Pay for your services.',
  pubkey: '2f63ebf3a3b18c988ca8f7da4ddee7ac',
  signature: preMadeSignature
}).then( output => {
  console.log(`Now I can send money to ${somePaymailAddress} using this output: ${output}`)
})

// You can check if a given key belongs to a given paymail
const somePubKey = bsv.PrivateKey.fromRandom().publicKey.toString()
client.verifyPubkeyOwner(somePubKey, 'someuser@moneybutton.com').then(aBoolean => {
  console.log(`The key ${somePubKey} ${aBoleean ? 'does' : 'doesn\'t'} belongs to someuser@moneybutton.com`)
})


// Lastly it lets you verify if certain signature is valid for certain paymail address.
const aMessage = new VerifiableMessage(['very', 'important', 'message'])
const aSignature = 'some signature for the message'
client.isValidSignature (aMessage, aSignature, 'someone@moneybutton.com').then( aBoolean => {
  if (aBoolean) {
    console.log('the signature is valid, yey!')
  } else {
    console.log('the signature is invalid, don\'t trust them')
  }
})
