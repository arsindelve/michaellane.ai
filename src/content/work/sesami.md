---
title: Modernization at Sesami
kind: work
order: 6.3
kicker: Led 18 engineers to decouple UI from backend services, rewrite the WPF front end, and ship the TR400
summary: As Director of Software Engineering for the Tidel Division, I led 16 engineers and 2 managers—rewriting the front end in WPF with clean separation between UI and backend services, launching the TR400 cash recycler on it, and migrating a two-decade-old Subversion codebase to Git and Azure DevOps with CI/CD, automated testing, real code review, and Scrum.
years: 2021 – 2022
role: Director of Software Engineering, Tidel Division
stack: [Azure IoT, SQL Server, WPF, Git, Azure DevOps, CI/CD]
cover: ../../assets/shots/sesami/sesami-tr400.png
coverAlt: "Sesami TR400 high-capacity cash recycler, launched on the rewritten WPF front end."
frameUrl: https://www.sesami.io/products/tr400
links:
  - { label: sesami.io/products/tr400, url: "https://www.sesami.io/products/tr400" }
stats:
  - { n: "20 yrs", label: "of legacy codebase modernized" }
  - { n: "18", label: "people led (16 engineers and 2 managers)" }
  - { n: "TR400", label: "cash recycler launched on a rewritten WPF UI" }
---

## The situation

The Tidel Division ran on a 20-year-old codebase in Subversion, powering intelligent cash-management devices and enterprise software across Azure IoT, SQL Server, and WPF. The product worked in the field, but the engineering workflow had accumulated two decades of friction: manual builds, no real code review, and limited automated testing.

## What I changed

Rather than pitching a risky rewrite of working hardware-connected software all at once, I modernized both the architecture and the engineering system around it:

- **WPF front-end rewrite & TR400 launch:** Rebuilt the device front end in WPF, cleanly separating the presentation layer from backend services, and shipped the **TR400** high-capacity cash recycler on the new UI.
- **Source control & platform:** Migrated the 20-year-old Subversion repository to Git and Azure DevOps without losing history or halting delivery.
- **CI/CD & automated testing:** Put automated build and test pipelines in place so changes were verified continuously instead of manually at release time.
- **Engineering cadence:** Introduced real code review and Scrum across 16 engineers and 2 managers, giving the team predictable delivery and shared ownership.
