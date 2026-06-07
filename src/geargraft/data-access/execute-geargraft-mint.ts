import type { useWalletUiSigner } from '@wallet-ui/react'

import { getCreateV1Instruction } from '@obrera/mpl-core-kit-lib'
import {
  appendTransactionMessageInstruction,
  assertIsTransactionMessageWithSingleSendingSigner,
  compileTransactionMessage,
  createTransactionMessage,
  generateKeyPairSigner,
  getBase58Decoder,
  getBase64Decoder,
  getCompiledTransactionMessageEncoder,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  type TransactionMessageBytesBase64,
} from '@solana/kit'

import type { SolanaClient } from '@/solana/data-access/solana-client'

export interface ExecuteGeargraftMintInput {
  client: SolanaClient
  metadataUri: string
  name: string
  transactionSigner: ReturnType<typeof useWalletUiSigner>
}

export interface GeargraftMintResult {
  assetAddress: string
  ownerAddress: string
  signature: string
}

export async function executeGeargraftMint({
  client,
  metadataUri,
  name,
  transactionSigner,
}: ExecuteGeargraftMintInput): Promise<GeargraftMintResult> {
  const asset = await generateKeyPairSigner()
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()
  const createAssetInstruction = getCreateV1Instruction({
    asset,
    authority: transactionSigner,
    dataState: 0,
    name: name.slice(0, 64),
    owner: transactionSigner.address,
    payer: transactionSigner,
    plugins: null,
    updateAuthority: transactionSigner.address,
    uri: metadataUri,
  })
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (transactionMessage) => setTransactionMessageFeePayerSigner(transactionSigner, transactionMessage),
    (transactionMessage) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, transactionMessage),
    (transactionMessage) => appendTransactionMessageInstruction(createAssetInstruction, transactionMessage),
  )

  assertIsTransactionMessageWithSingleSendingSigner(message)

  const encodedMessage = getCompiledTransactionMessageEncoder().encode(compileTransactionMessage(message))
  const [{ value: balance }, { value: fee }] = await Promise.all([
    client.rpc.getBalance(transactionSigner.address, { commitment: 'confirmed' }).send(),
    client.rpc
      .getFeeForMessage(getBase64Decoder().decode(encodedMessage) as TransactionMessageBytesBase64, {
        commitment: 'confirmed',
      })
      .send(),
  ])

  if (fee === null) {
    throw new Error('Unable to estimate the mint transaction fee. Try again with a fresh blockhash.')
  }
  if (balance < fee) {
    throw new Error('Not enough devnet SOL to pay transaction fees.')
  }

  const signatureBytes = await signAndSendTransactionMessageWithSigners(message)
  const signature = getBase58Decoder().decode(signatureBytes)

  if (!signature) {
    throw new Error('Transaction submitted but no signature was returned by the wallet.')
  }

  return {
    assetAddress: asset.address,
    ownerAddress: transactionSigner.address,
    signature,
  }
}
