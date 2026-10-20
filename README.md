# Book Reconciliation Automation Demo

A fully sanitized public demonstration of a financial reconciliation workflow that matches synthetic bank transactions against synthetic book records, routes ambiguous items to human review, and generates an operational reconciliation summary.

> **Live Demo:** https://jcmejia-dev.github.io/book-reconciliation-automation-demo/
>
> **Portfolio:** https://jcmejia.vercel.app

## Why this project exists

The original automation work that inspired this demo involved private company financial operations. Publishing the production workflow, credentials, internal endpoints, or real financial records would be inappropriate.

This repository therefore recreates the **engineering concepts** using completely invented data and a browser-only implementation that is safe to inspect publicly.

## What the demo shows

- Preflight validation before reconciliation begins
- Comparison of a bank feed against book-ledger records
- Automatic matching only when the reference and amount both agree
- Amount/reference mismatches routed into a **Human Review Queue**
- No forced reconciliation of ambiguous records
- Reconciliation totals and match-rate calculations
- Discord-style operational reporting
- A simple staged workflow: **Preflight → Compile → Match → Exceptions → Report**

## Tech

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages
- Browser-side reconciliation logic

No backend, database, production API, API key, webhook, or external financial service is required.

## Matching logic

A record is automatically reconciled only when:

1. the bank reference exists in the ledger; and
2. the amount matches exactly.

Anything uncertain is held for review.

Examples in the demo:

- Same reference + same amount → **safe match**
- Same reference + different amount → **human review**
- Same amount + different reference → **human review**
- No reliable match → **human review**

This is intentional. Financial automation should prefer a clear exception state over silently forcing an uncertain decision.

## Architecture

```text
Synthetic Bank Feed
        │
        ├──────────────┐
        │              │
        ▼              ▼
   Preflight      Synthetic Ledger
        │              │
        └──────┬───────┘
               ▼
           Compile
               │
               ▼
         Matching Rules
          ┌────┴────┐
          ▼         ▼
     Safe Match   Exception
          │         │
          │         ▼
          │    Human Review
          └────┬────┘
               ▼
      Operational Summary
```

## Data safety

Everything in this repository is synthetic.

The following were **not** copied from a production system:

- company names
- customer or vendor names
- bank account numbers
- transaction references
- financial amounts
- dates
- API endpoints
- API keys
- Discord webhooks
- Google Sheet IDs
- credentials
- internal business records

The names such as `Northwind Supplies`, `Harborline Logistics`, and the references beginning with `BNK-` were created only for this demo.

## Run locally

Because this is a static application, you can open `index.html` directly in a browser or serve the folder with any static server.

For example:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## What I built

I designed and implemented the public sandbox, reconciliation decision rules, exception routing, workflow-state animation, metrics, and operational report UI.

The purpose of the demo is to provide interviewers and recruiters with verifiable technical evidence while preserving the confidentiality of the private systems that inspired it.

## Related skills

`Workflow Automation` · `JavaScript` · `REST/API Concepts` · `Financial Reconciliation` · `Exception Handling` · `Human-in-the-loop Automation` · `Operational Reporting`

---

Built by **Jamie Cristian A. Mejia**  
GitHub: https://github.com/jcmejia-dev