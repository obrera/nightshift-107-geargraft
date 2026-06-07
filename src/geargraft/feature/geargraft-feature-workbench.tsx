import { useWalletUi } from '@wallet-ui/react'
import { useState } from 'react'

import type { GeargraftMintResult } from '@/geargraft/data-access/execute-geargraft-mint'

import {
  catalysts,
  defaultCraft,
  defaultOperatorSettings,
  equipmentBases,
  type GeargraftCraft,
  materialFinishes,
  palettes,
  runeOrnaments,
} from '@/geargraft/data-access/geargraft-model'
import { GeargraftFeatureMintPanel } from '@/geargraft/feature/geargraft-feature-mint-panel'
import { GeargraftUiChoiceGrid } from '@/geargraft/ui/geargraft-ui-choice-grid'
import { GeargraftUiMetadata } from '@/geargraft/ui/geargraft-ui-metadata'
import { GeargraftUiOperator } from '@/geargraft/ui/geargraft-ui-operator'
import { GeargraftUiPreview } from '@/geargraft/ui/geargraft-ui-preview'
import { SolanaUiWalletDialog } from '@/solana/ui/solana-ui-wallet-dialog'

export function Component() {
  return <GeargraftFeatureWorkbench />
}

export function GeargraftFeatureWorkbench() {
  const [craft, setCraft] = useState(defaultCraft)
  const [mintResult, setMintResult] = useState<GeargraftMintResult>()
  const [settings, setSettings] = useState(defaultOperatorSettings)
  const { account } = useWalletUi()

  function patchCraft(patch: Partial<GeargraftCraft>) {
    setCraft((current) => ({ ...current, ...patch }))
  }

  return (
    <div className="min-h-full bg-[#050607] text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <GeargraftUiPreview craft={craft} settings={settings} />
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]">
          <div className="space-y-5 rounded-md border border-zinc-800 bg-zinc-950/72 p-4">
            <GeargraftUiChoiceGrid
              label="Equipment base"
              options={equipmentBases}
              select={(base) => patchCraft({ base })}
              value={craft.base}
            />
            <GeargraftUiChoiceGrid
              label="Material finish"
              options={materialFinishes}
              select={(finish) => patchCraft({ finish })}
              value={craft.finish}
            />
            <GeargraftUiChoiceGrid
              label="Rune ornament"
              options={runeOrnaments}
              select={(rune) => patchCraft({ rune })}
              value={craft.rune}
            />
            <GeargraftUiChoiceGrid
              label="Catalyst"
              options={catalysts}
              select={(catalyst) => patchCraft({ catalyst })}
              value={craft.catalyst}
            />
            <GeargraftUiChoiceGrid
              label="Palette"
              options={palettes}
              select={(palette) => patchCraft({ palette })}
              value={craft.palette}
            />
          </div>
          <div className="space-y-5">
            <GeargraftUiOperator craft={craft} settings={settings} updateSettings={setSettings} />
            {account ? (
              <GeargraftFeatureMintPanel account={account} craft={craft} onMinted={setMintResult} settings={settings} />
            ) : (
              <section className="rounded-md border border-cyan-300/30 bg-black p-4">
                <h2 className="text-sm font-black tracking-[0.16em] text-cyan-200 uppercase">Wallet-signed Mint</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Connect a Solana devnet wallet to sign proof messages and mint the crafted MPL Core equipment skin.
                </p>
                <div className="mt-3">
                  <SolanaUiWalletDialog />
                </div>
              </section>
            )}
          </div>
        </div>
        <GeargraftUiMetadata craft={craft} mintResult={mintResult} owner={account?.address} settings={settings} />
      </div>
    </div>
  )
}
