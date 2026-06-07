import type { GeargraftMintResult } from '@/geargraft/data-access/execute-geargraft-mint'
import type { GeargraftCraft, GeargraftOperatorSettings } from '@/geargraft/data-access/geargraft-model'

import { createGeargraftMetadata, metadataDataUri } from '@/geargraft/data-access/create-geargraft-metadata'
import { verifyGeargraftProof } from '@/geargraft/data-access/verify-geargraft-proof'
import { createGeargraftSvg } from '@/geargraft/util/geargraft-svg'

export function GeargraftUiMetadata({
  craft,
  mintResult,
  owner,
  settings,
}: {
  craft: GeargraftCraft
  mintResult?: GeargraftMintResult
  owner?: string
  settings: GeargraftOperatorSettings
}) {
  const metadata = createGeargraftMetadata(craft, settings, owner)
  const metadataUri = metadataDataUri(metadata)
  const proof = verifyGeargraftProof({
    asset: mintResult?.assetAddress ?? '',
    owner: mintResult?.ownerAddress ?? owner ?? '',
    signature: mintResult?.signature ?? '',
  })

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-md border border-zinc-800 bg-zinc-950/86 p-4">
        <h2 className="text-sm font-black tracking-[0.16em] text-cyan-200 uppercase">First-party Metadata</h2>
        <div className="mt-3 grid gap-2 text-xs text-zinc-400">
          <CodeLine label="JSON URI" value={metadataUri} />
          <CodeLine label="SVG bytes" value={`${createGeargraftSvg(craft, settings).length}`} />
        </div>
        <pre className="mt-3 max-h-64 overflow-auto rounded-md border border-zinc-800 bg-black p-3 text-xs whitespace-pre-wrap text-zinc-300">
          {JSON.stringify(metadata, null, 2)}
        </pre>
      </div>
      <div className="rounded-md border border-zinc-800 bg-zinc-950/86 p-4">
        <h2 className="text-sm font-black tracking-[0.16em] text-orange-300 uppercase">Verifier Proof Fields</h2>
        <div className="mt-3 space-y-2 text-sm">
          <CodeLine label="Owner" value={mintResult?.ownerAddress ?? owner ?? 'Connect wallet'} />
          <CodeLine label="Asset" value={mintResult?.assetAddress ?? 'Mint to produce asset address'} />
          <CodeLine label="Signature" value={mintResult?.signature ?? 'Mint to produce transaction signature'} />
          <CodeLine label="Explorer asset" value={proof.explorerAsset || 'Pending'} />
          <CodeLine label="Explorer tx" value={proof.explorerSignature || 'Pending'} />
        </div>
        <div className="mt-3 rounded border border-cyan-300/25 bg-cyan-950/20 px-3 py-2 text-sm text-cyan-100">
          {proof.ok
            ? 'Proof fields are explorer-ready for devnet verification.'
            : 'Paste or mint asset fields to verify format.'}
        </div>
        {proof.warnings.map((warning) => (
          <div
            className="mt-2 rounded border border-orange-300/25 bg-orange-950/20 px-3 py-2 text-sm text-orange-100"
            key={warning}
          >
            {warning}
          </div>
        ))}
      </div>
    </section>
  )
}

function CodeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded border border-zinc-800 bg-black px-3 py-2">
      <div className="text-[0.65rem] font-black tracking-[0.14em] text-zinc-500 uppercase">{label}</div>
      <div className="mt-1 truncate font-mono text-xs text-zinc-200" title={value}>
        {value}
      </div>
    </div>
  )
}
