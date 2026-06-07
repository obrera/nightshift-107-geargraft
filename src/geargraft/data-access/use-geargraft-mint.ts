import { useMutation } from '@tanstack/react-query'
import { type UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'

import type { SolanaClient } from '@/solana/data-access/solana-client'

import { executeGeargraftMint } from '@/geargraft/data-access/execute-geargraft-mint'

export function useGeargraftMint({ account, client }: { account: UiWalletAccount; client: SolanaClient }) {
  const transactionSigner = useWalletUiSigner({ account })
  const mintMutation = useMutation({
    mutationFn: ({ metadataUri, name }: { metadataUri: string; name: string }) =>
      executeGeargraftMint({ client, metadataUri, name, transactionSigner }),
  })

  return {
    mint: mintMutation.mutateAsync,
    mintError: mintMutation.error,
    mintResult: mintMutation.data,
    mintStatus: mintMutation.status,
    resetMint: mintMutation.reset,
  }
}
