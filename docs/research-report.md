# Affiliate Networks — Research Report

Findings from current **official** documentation, gathered before implementation.
Each network is split into **Confirmed by official docs**, **Requires account
approval**, **Requires credentials**, and **Not currently confirmed**. Nothing
below is assumed; capabilities we could not confirm are marked accordingly and
the code is designed around the limitation rather than pretending it exists.

> Status of build: **architecture + adapters + config + admin + tests** are in
> place. Only **Amazon** can run live (once its credentials are set). Awin,
> impact.com and CJ adapters are scaffolded and report "not configured" until
> credentials/approvals arrive — they never fake data.

---

## 1. Amazon Associates — Creators API

**CONFIRMED BY OFFICIAL DOCUMENTATION**
- Creators API is the **current** supported API and the replacement for Product
  Advertising API (PA-API 5.0).
- Auth: **OAuth 2.0 `client_credentials`**. v2.x = Amazon Cognito, v3.x = Login
  with Amazon (LWA). Access token ~1h; cache + renew.
- Host: `https://creatorsapi.amazon/catalog/v1/`; `POST /searchItems`, `/getItems`,
  `/getBrowseNodes`, `/getVariations`. Body is **lowerCamelCase** (`keywords`,
  `partnerTag`, `itemIds`, `resources`). Header `x-marketplace: www.amazon.co.uk`.
- Product **search** and **detail (by ASIN)**: yes. Images, price, availability,
  offers; rating/reviews where the account is permitted.
- Deep/affiliate link: the API returns a `detailPageURL` already carrying the
  Partner Tag; per-marketplace Partner Tags required (a US tag is invalid on EU).
- Country support (our targets): UK, DE, FR, IT, ES, NL, PL, SE (+ US, CA, and
  amazon.co.za / amazon.eg).
- Data-use: prices/availability are time-sensitive; cache conservatively and
  confirm live on Amazon.

**REQUIRES ACCOUNT APPROVAL**
- Amazon Associates account in good standing **with Creators API access enabled**
  (typically needs qualifying sales).

**REQUIRES CREDENTIALS**
- `AMAZON_CREATOR_CREDENTIAL_ID`, `AMAZON_CREATOR_CREDENTIAL_SECRET`,
  `AMAZON_CREATOR_VERSION` (EU = `2.2`/`3.2`, NA = `2.1`/`3.1`), and a
  Partner Tag per marketplace.

**NOT CURRENTLY CONFIRMED**
- Reviews resource availability varies by account (kept opt-in in code).

_Status in this codebase: **fully integrated** (`lib/amazon/*`), wrapped by
`AmazonAffiliateProvider`._

---

## 2. Awin — Publisher API + Product Feeds

**CONFIRMED BY OFFICIAL DOCUMENTATION**
- Auth: **OAuth 2.0 Bearer token**. A **personal API token** is generated in the
  UI (`ui.awin.com/awin-api` → "Show my API token"). Sent as
  `Authorization: Bearer {token}`. REST base: `https://api.awin.com`.
  (Exception: the Create-Transactions API uses an API key.)
- The token is tied to the **user**, granting access to all publisher accounts
  the user can see; a **Publisher ID** identifies the account for calls/feeds.
- **Product data comes from Product Feeds**, not a real-time product-search API.
  Awin's "Create-a-Feed" produces downloadable feeds (CSV/GZIP) with product
  name, description, price, images and **deep links**. Publisher APIs let you
  **list available feeds** and **check feed update info** before downloading, so
  you don't re-download unchanged feeds.
- Deep links: constructed via Awin's link/URL format for a joined advertiser
  (publisher id + advertiser id + `clickref`/`ued` destination).

**REQUIRES ACCOUNT APPROVAL**
- An approved **Publisher** account, and **joining each advertiser programme**
  to receive commissionable links / access their feed.

**REQUIRES CREDENTIALS**
- `AWIN_API_TOKEN` (personal OAuth bearer token), `AWIN_PUBLISHER_ID`.
- Feed access may also use a feed-list API token + advertiser/feed IDs
  (discovered per account).

**NOT CURRENTLY CONFIRMED**
- A generic real-time "product search" endpoint (Awin is **feed-first**). We
  therefore mark `productSearch = false`, `productFeed = true` for Awin and
  design sync around feed download + update-check.

---

## 3. impact.com — Publisher (Media Partner) API + Catalogs

**CONFIRMED BY OFFICIAL DOCUMENTATION**
- Auth: **HTTP Basic** — `AccountSID` as username, `AuthToken` as password.
- Publisher (media partner) endpoints under
  `https://api.impact.com/Mediapartners/{AccountSID}/...`.
- **Product Catalogs**: brands publish product catalogs (feeds) with metadata
  (name, image, price, URL). Publishers can **retrieve catalogs and catalog
  items** (`/Catalogs/{Id}`, `/Catalogs/{CatalogId}/Items`) — **for brands whose
  catalog is shared with the partner**.
- Deep/tracking links: created via the Media Partner tracking-link endpoints.
- Campaigns/programs: the partner's contracts with brands are represented via
  the Campaigns endpoints.

**REQUIRES ACCOUNT APPROVAL**
- An approved **Media Partner** account **and a contract with each brand**
  (program). Catalog access depends on the **brand sharing its catalog** with
  the partner. Approval ≠ automatic API/catalog access.

**REQUIRES CREDENTIALS**
- `IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`.

**NOT CURRENTLY CONFIRMED**
- Cross-brand product **search** across all catalogs (retrieval is per shared
  catalog). We model program approval explicitly (`programStatus`) and treat
  catalogs as feed-like.

---

## 4. CJ Affiliate — Publisher GraphQL/REST APIs

**CONFIRMED BY OFFICIAL DOCUMENTATION**
- Auth: **Bearer Personal Access Token (PAT)** + **CID (Company/Publisher ID,
  ~7 digits)**. No OAuth flow. Developer portal: `developers.cj.com`.
- **GraphQL** endpoint `https://ads.api.cj.com/query` supports **product search /
  shopping product feed** (filter by price, currency, country, serviceable area,
  UPC, etc.).
- **REST Link Search** supports finding links by keyword, country, category,
  relationship status with the advertiser, and link type.
- Deep/affiliate links: available for advertisers you have a **relationship**
  with; link generation reflects that relationship.

**REQUIRES ACCOUNT APPROVAL**
- A CJ **Publisher** account with a PAT, and **joined advertisers** for
  commissionable links / their product data (relationship status gates access).

**REQUIRES CREDENTIALS**
- `CJ_PERSONAL_ACCESS_TOKEN`, `CJ_CID`.

**NOT CURRENTLY CONFIRMED**
- Whether every product is queryable before joining the advertiser — depends on
  relationship status. We surface products/links according to relationship
  rather than assuming universal access.

---

## Cross-cutting design decisions (driven by the above)

- **Product ≠ Offer.** A canonical Product can have many Offers (per provider ×
  merchant × country). Comparison and multi-network support fall out of this.
- **Capability detection per provider** (`productSearch`, `productFeed`,
  `deepLinks`, `priceData`, `availability`, `variations`, `requiresProgramApproval`)
  so the app never calls an operation a network doesn't offer.
- **Feed-first vs search-first**: Amazon & CJ are search-capable; Awin & impact
  are catalog/feed-based. The sync engine is designed for both (download + parse
  + normalize + dedupe + upsert with update-checks), but is **not run** until
  credentials exist.
- **Program approval is data.** Offers/merchants carry a `programStatus`
  (`available | applied | approved | rejected | inactive`) because approval and
  API access are distinct.
- **Caching**: store `lastSyncedAt` / `sourceUpdatedAt`; refresh on a schedule
  and respect each network's data-use terms. Never call an external API on every
  product page view.
- **Deduplication** is confidence-based (GTIN/UPC/EAN/ISBN > brand+MPN >
  brand+model > ASIN); title similarity **never** auto-merges.

Sources: Amazon Creators API docs; Awin API authentication + developer docs;
impact.com Integrations Hub (authentication + catalogs/items); CJ Developer Portal
(GraphQL product search + REST link search).
