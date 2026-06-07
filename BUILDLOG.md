# Nightshift Build 107: GearGraft

## Metadata

- Build: 107
- Name: GearGraft
- Repo: obrera/nightshift-107-geargraft
- Desired live URL: https://geargraft107.colmena.dev
- Agent: OpenAI Codex
- Model: GPT-5.5 Codex
- Reasoning: n/a
- Started: 2026-06-07T01:00:00Z
- Latest log entry: 2026-06-07T01:17:44Z
- NFT/game-use case family: sci-fi playable equipment skin cosmetics for arena/loadout games
- Primary actor: player or cosmetic designer crafting a transferable equipment skin NFT
- Secondary actor: creator/operator tuning recipe rules, supply readiness, season settings, and invalid warnings

## Scorecard

- Craft bench with base, finish, rune, catalyst, palette, deterministic SVG preview, rarity, stats, stability/risk, and compatibility: implemented
- Creator/operator rule rack with forge heat, material stock, quality floor, season, signature requirement, readiness, and invalid warnings: implemented
- First-party JSON/SVG/data URI metadata preview: implemented
- Verifier panel with owner, asset, signature, and devnet explorer proof fields: implemented
- Wallet-ui connection: implemented
- Client-side wallet-signed MPL Core devnet equipment-skin mint path: implemented
- Required `@obrera/mpl-core-kit-lib` dependency: pinned to 0.0.3
- Forbidden imports `@solana/web3.js` and `@solana/wallet-adapter-react`: not used
- Backend signer/server mint: not used
- Live mint proof: blocked in this terminal environment because no interactive browser wallet is available
- Dokploy deployment: completed, live URL returned HTTP 200

## Log

- 2026-06-07T01:00:00Z - Selected build 107 after the latest completed Nightshift row and chose GearGraft to avoid repeating DropLink's claim-link app shape.
- 2026-06-07T01:01:00Z - Created a fresh `bun-react-vite-solana-kit` seed under `~/projects/nightshift-107-geargraft`.
- 2026-06-07T01:05:00Z - Installed published `@obrera/mpl-core-kit-lib@0.0.3` from npm.
- 2026-06-07T01:08:00Z - Added feature-based GearGraft implementation under `src/geargraft/{data-access,feature,ui,util}`.
- 2026-06-07T01:10:00Z - Added client-side wallet-signed MPL Core `getCreateV1Instruction` mint path with the connected wallet as payer, owner, authority, and update authority.
- 2026-06-07T01:11:00Z - Added README, BUILDLOG, Dockerfile, docker-compose.yml, and static Bun server with `/healthz`.
- 2026-06-07T01:13:00Z - Ran lint, typecheck, and production build successfully before pushing the project repo.
- 2026-06-07T01:16:59Z - Verified `https://geargraft107.colmena.dev/healthz` returned HTTP 200 with `{"build":107,"name":"GearGraft","ok":true}`.
- 2026-06-07T01:17:44Z - Normalized this build log to the timestamped Nightshift format before final registry updates.

## Solana Notes

The primary action is minting a crafted equipment skin as an MPL Core devnet asset. The app uses wallet-ui to obtain the connected account and signer, generates the asset signer client-side, creates first-party JSON metadata and SVG media as data URIs, and sends the transaction with `signAndSendTransactionMessageWithSigners`. Ownership matters because the minted equipment skin is a transferable game cosmetic/permit that a game, tournament, or creator operator can verify by asset address, owner, and transaction signature.

No live mint proof was executed during implementation because this terminal environment has no interactive wallet session. The real wallet-signed client path is implemented and exposed on the live site.
