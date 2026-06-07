import { type UiWalletAccount, useWalletUi } from '@wallet-ui/react'
import { Coins, FileSignature, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { GeargraftMintResult } from '@/geargraft/data-access/execute-geargraft-mint'
import type { GeargraftCraft, GeargraftOperatorSettings } from '@/geargraft/data-access/geargraft-model'

import { Button } from '@/core/ui/button'
import { createGeargraftMetadata, metadataDataUri } from '@/geargraft/data-access/create-geargraft-metadata'
import { craftLabel, scoreCraft } from '@/geargraft/data-access/geargraft-model'
import { useGeargraftMint } from '@/geargraft/data-access/use-geargraft-mint'
import { useSolanaClient } from '@/solana/data-access/use-solana-client'
import { useWalletSignMessage } from '@/wallet/data-access/use-wallet-sign-message'

export function GeargraftFeatureMintPanel({
  account,
  craft,
  onMinted,
  settings,
}: {
  account: UiWalletAccount
  craft: GeargraftCraft
  onMinted: (result: GeargraftMintResult | undefined) => void
  settings: GeargraftOperatorSettings
}) {
  const client = useSolanaClient()
  const { cluster } = useWalletUi()
  const { mint, mintError, mintResult, mintStatus, resetMint } = useGeargraftMint({ account, client })
  const { isLoading: isSigningProof, signMessage } = useWalletSignMessage({ account })
  const [proofSignature, setProofSignature] = useState('')
  const score = scoreCraft(craft, settings)
  const metadataUri = useMemo(
    () => metadataDataUri(createGeargraftMetadata(craft, settings, account.address)),
    [account.address, craft, settings],
  )
  const canMint = cluster.id === 'solana:devnet' && score.warnings.length === 0

  return (
    <section className="rounded-md border border-cyan-300/30 bg-black p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-black tracking-[0.16em] text-cyan-200 uppercase">Wallet-signed Mint</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Connected wallet owns and signs the MPL Core devnet asset. Active cluster: {cluster.label}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isSigningProof}
            onClick={async () => {
              const signature = await signMessage(
                `GearGraft SIWS proof\nOwner: ${account.address}\nCraft: ${craftLabel(craft)}\nSeason: ${settings.season}`,
              )
              setProofSignature(signature)
            }}
            size="sm"
            variant="secondary"
          >
            <FileSignature className="size-4" />
            Sign Proof
          </Button>
          <Button
            disabled={!canMint || mintStatus === 'pending'}
            onClick={async () => {
              const result = await mint({ metadataUri, name: craftLabel(craft) })
              onMinted(result)
            }}
            size="sm"
          >
            <Coins className="size-4" />
            Mint Skin
          </Button>
          {mintResult ? (
            <Button
              onClick={() => {
                resetMint()
                onMinted(undefined)
              }}
              size="icon"
              title="Clear mint result"
              variant="outline"
            >
              <RotateCcw className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
      {!canMint ? (
        <div className="mt-3 rounded border border-orange-300/25 bg-orange-950/20 px-3 py-2 text-sm text-orange-100">
          Use Solana devnet and clear operator warnings before minting.
        </div>
      ) : null}
      {proofSignature ? (
        <div className="mt-3 rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
          <div className="text-[0.65rem] font-black tracking-[0.14em] text-zinc-500 uppercase">Signed proof</div>
          <div className="mt-1 truncate font-mono text-xs text-cyan-100" title={proofSignature}>
            {proofSignature}
          </div>
        </div>
      ) : null}
      {mintResult ? (
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <Proof label="Asset" value={mintResult.assetAddress} />
          <Proof label="Owner" value={mintResult.ownerAddress} />
          <Proof label="Signature" value={mintResult.signature} />
        </div>
      ) : null}
      {mintError ? (
        <div className="mt-3 rounded border border-red-400/25 bg-red-950/30 px-3 py-2 text-sm text-red-100">
          {mintError.message}
        </div>
      ) : null}
    </section>
  )
}

function Proof({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
      <div className="text-[0.65rem] font-black tracking-[0.14em] text-zinc-500 uppercase">{label}</div>
      <div className="mt-1 truncate font-mono text-xs text-zinc-100" title={value}>
        {value}
      </div>
    </div>
  )
}
