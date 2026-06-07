export function verifyGeargraftProof({ asset, owner, signature }: { asset: string; owner: string; signature: string }) {
  const base58ish = /^[1-9A-HJ-NP-Za-km-z]+$/
  const warnings = [
    ...(asset && (!base58ish.test(asset) || asset.length < 32)
      ? ['Asset address does not look like a Solana address.']
      : []),
    ...(owner && (!base58ish.test(owner) || owner.length < 32)
      ? ['Owner address does not look like a Solana address.']
      : []),
    ...(signature && (!base58ish.test(signature) || signature.length < 64)
      ? ['Signature does not look explorer-ready.']
      : []),
  ]

  return {
    explorerAsset: asset ? `https://explorer.solana.com/address/${asset}?cluster=devnet` : '',
    explorerSignature: signature ? `https://explorer.solana.com/tx/${signature}?cluster=devnet` : '',
    ok: Boolean(asset && owner && signature && warnings.length === 0),
    warnings,
  }
}
