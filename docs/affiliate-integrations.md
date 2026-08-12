# Affiliate Integrations

How the multi-network affiliate architecture works, how to add credentials, and
how to activate each network. See `docs/research-report.md` for the underlying
API research (confirmed vs. requires-approval).

## 1. Architecture

```
Marketplace Frontend
      ↓
Unified Product/Offers API      (app/api/products/[id]/offers, app/api/amazon/*)
      ↓
Affiliate Link Service          (lib/affiliate/link-service.ts)
      ↓
Provider Registry               (lib/affiliate/registry.ts)
      ├── AmazonAffiliateProvider   (live — wraps lib/amazon/*)
      ├── AwinAffiliateProvider     (scaffold)
      ├── ImpactAffiliateProvider   (scaffold)
      └── CjAffiliateProvider       (scaffold)
      ↓
External Affiliate Networks
```

The frontend never knows which network a product/offer came from. It receives
**NormalizedProduct** / **NormalizedOffer** shapes (`lib/affiliate/types.ts`).

Key modules:
- `types.ts` — normalized shapes, `AffiliateProvider` interface, capabilities.
- `config.ts` — feature flags + credential presence (names only, never values).
- `providers/*` — one adapter per network, extending `BaseProvider`.
- `registry.ts` — assembles providers; `searchAllProviders()` isolates failures.
- `normalize.ts` / `dedupe.ts` / `offers.ts` — pure helpers (unit-tested).
- `link-service.ts` — resolves a product's offers (Amazon availability + synced
  `ProductOffer` rows) and the best link.

## 2. Data model — Product ≠ Offer

- **MarketProduct** — the canonical product (existing table). Amazon per-country
  availability stays in `amazonAvailability`. Added `gtin` / `mpn` for matching.
- **ProductOffer** — one buy option per `provider × merchant × country`, with
  price, currency, availability, `affiliateUrl`, `programStatus`. Other networks
  populate this during sync. One product → many offers → offer comparison.

Run the SQL in the deploy notes (or `npm run db:push`) to create `ProductOffer`
and the new columns. The marketplace keeps working before it exists (offers fall
back to Amazon only).

## 3. Amazon integration (live)

Already integrated (`lib/amazon/*`), wrapped by `AmazonAffiliateProvider`.
- Auth: OAuth2 client_credentials (Cognito v2.x / LWA v3.x). Env:
  `AMAZON_CREATOR_CREDENTIAL_ID/SECRET/VERSION` + `AMAZON_<CC>_PARTNER_TAG`.
- Search + detail + tagged detail URLs. See the Amazon section of the deploy env.

## 4. Awin integration (prepared)

- Auth: OAuth2 Bearer **personal API token** (`AWIN_API_TOKEN`), base
  `https://api.awin.com`, plus `AWIN_PUBLISHER_ID`.
- **Feed-based** (`productSearch=false`, `productFeed=true`). Sync design: list
  feeds → check feed update info → download (CSV/GZIP) → parse → `normalizeFeedRow`
  → dedupe → upsert `ProductOffer` → store deep link. Deep links require joining
  the advertiser programme.

## 5. impact.com integration (prepared)

- Auth: HTTP **Basic** — `IMPACT_ACCOUNT_SID` (user) + `IMPACT_AUTH_TOKEN` (pass).
  Publisher endpoints under `/Mediapartners/{AccountSID}/...`.
- **Catalog-based**. Retrieve shared brand catalogs + items; tracking links for
  deep links. Requires a media-partner account **and a contract per brand**, and
  the brand must share its catalog. Program approval is stored per offer.

## 6. CJ Affiliate integration (prepared)

- Auth: Bearer **Personal Access Token** (`CJ_PERSONAL_ACCESS_TOKEN`) + `CJ_CID`.
  GraphQL `https://ads.api.cj.com/query` (product search) + REST link search.
- Product search + feed. Commissionable links/data depend on the advertiser
  relationship (stored per offer).

## 7. Environment variables

See `.env.example`. Feature flags: `AMAZON_ENABLED` (default true),
`AWIN_ENABLED` / `IMPACT_ENABLED` / `CJ_ENABLED` (default false). All secrets are
server-side only — never `NEXT_PUBLIC_*`, never returned in API responses.

## 8. Provider onboarding (activation)

For each network, once your account/program is approved:
1. Obtain the credentials listed above.
2. Add them to Vercel env (Production/Preview/Development).
3. Flip the provider's feature flag to `true`.
4. Redeploy. The admin **Affiliate networks** page should show “Credentials
   configured”. No code changes required.

## 9. Product synchronization (not yet activated)

Designed jobs (per provider, run only after activation):
`syncProviderProducts`, `syncProviderOffers`, `updateProductPrices`,
`updateAvailability`, `removeExpiredOffers`. Supports pagination, retries,
exponential backoff, rate limiting, incremental updates + checkpointing. For Awin,
use feed **update-checks** before re-downloading. **Mass imports are intentionally
NOT run** until you confirm approvals.

## 10. Affiliate link generation

`GET /api/products/:id/offers?country=XX` returns normalized offers with the
correct `affiliateUrl` per provider, resolved server-side. Credentials never
reach the browser. We never fabricate tags/links.

## 11. Country handling

Country codes come from `lib/marketplace.ts` (UK, DE, FR, IT, ES first; NL, PL,
SE, US, CA and more available). Each offer carries its own `country`; not every
provider supports every country — capabilities + per-offer country model this.

## 12. Troubleshooting

- **“Not configured”** on a provider → set its env vars + flag, redeploy.
- **Amazon works, others silent** → expected until activated; failures are
  isolated so the marketplace never breaks.
- **Offers show only Amazon** → `ProductOffer` table not created / no sync yet.

## 13. Adding another affiliate network

1. Add its id to `ProviderId` + names/required-vars in `config.ts`.
2. Create `lib/affiliate/providers/<name>.ts` extending `BaseProvider`, declaring
   real capabilities and implementing the operations it supports.
3. Register it in `registry.ts`.
4. Add env placeholders to `.env.example` + a feature flag.
That's it — the frontend and offers API are already provider-agnostic.
