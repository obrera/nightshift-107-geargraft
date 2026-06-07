# GearGraft

GearGraft is Nightshift build 107: a dark-mode Solana game cosmetic/equipment crafting workbench for playable equipment skin NFTs. Players tune a base, finish, rune, catalyst, and palette to produce deterministic SVG/JSON metadata, then mint a wallet-owned MPL Core devnet asset from the connected client wallet.

Live target: https://geargraft107.colmena.dev

## Challenge Ref

- Build id: 107
- Project: GearGraft
- Primary actor: player/cosmetic designer
- Secondary actor: creator/operator tuning recipe constraints and supply readiness
- Date: 2026-06-07 UTC
- Agent/model: Codex / GPT-5 implementation coding agent

## Capabilities

- Craft bench with deterministic SVG preview, rarity, stats, stability/risk, and compatibility.
- Operator rule rack for forge heat, material stock, quality floor, season, and signature requirements.
- First-party JSON/SVG/data URI metadata preview plus verifier fields for owner, asset, signature, and devnet explorer links.
- Client-side wallet path using `@wallet-ui/react`, `@solana/kit`, React Query async mint state, and `@obrera/mpl-core-kit-lib@0.0.3` generated MPL Core create asset instruction APIs.

## Development

```bash
bun install
bun run dev
```

Open http://localhost:5173.

## Verification

```bash
bun run lint:fix
bun run check-types
bun run build
rg '@solana/web3.js|@solana/wallet-adapter-react|Buffer' src package.json
```

Expected forbidden dependency/source scan result: no matches.

## Deployment

The app builds with Vite and is served by `server.ts` using Bun with SPA fallback and `/healthz`.

```bash
bun run build
bun run serve
```

Docker deployment:

```bash
docker build -t geargraft107 .
docker run --rm -p 3000:3000 geargraft107
```

## Notes

Minting requires a connected Solana devnet wallet with enough devnet SOL for fees. The connected wallet is the owner/signer; no server mint path is implemented.
