---
title: Core Services at Cart.com
kind: work
order: 6.2
kicker: Half a dozen acquired companies, one login, one front door
summary: Cart.com grew by buying companies, and every one of them came with its own login. I led Core Services, the team of six that built a single sign-on across all of them and Brand HQ, the one portal where a brand could see its orders and run its own account.
years: 2022 – 2023
role: Director of Engineering, Core Services
stack: [Auth0, Okta, Kafka, Event-driven microservices, Google Cloud]
cover: ../../assets/shots/cart/cart-home-2022-hero.png
coverAlt: Cart.com's 2022 home page, "Where brands go to grow," with six columns for its services.
frameUrl: https://www.cart.com/
slides:
  - { src: ../../assets/shots/cart/cart-home-2022-hero.png, path: "", caption: "2022: six services under one name, each with its own login", alt: "Cart.com's 2022 home page: Where brands go to grow, with six columns for Storefront, Growth Marketing, Channel Management, Fulfillment, Customer Engagement and Unified Analytics, and a strip of brands trusted by over 6,000." }
  - { src: ../../assets/shots/cart/cart-home-2022-stats.png, path: "", caption: "6,000 brands, 41 million orders a year", alt: "Cart.com's 2022 stats: 6k+ brands, 20k+ online stores, 142M+ products, 2k+ advertising channels, 22M+ daily repricing events, 41M+ orders a year, 3.5M+ square feet of fulfillment space and $3B+ annual GMV." }
  - { src: ../../assets/shots/cart/cart-fulfillment-2022-order-management.png, path: "/solution/fulfillment", caption: "Every order, tracked from start to finish", alt: "Cart.com's order management section: automate order management to deliver with accuracy, with an order summary illustration." }
stats:
  - { n: "6", label: "acquired companies behind one login" }
  - { n: "1", label: "customer portal: Brand HQ" }
  - { n: "6", label: "people on the team, me included" }
  - { n: "1000s", label: "of orders an hour from our biggest brands" }
---

## One company, six front doors

Cart.com set out to give online brands everything behind the storefront in one place: fulfillment, marketplaces, marketing, financing. It got there quickly by acquiring companies that already did each of those things well.

The catch was what a customer saw. A brand using several of Cart's services had to log in to each one separately, with a different account at every company Cart had bought. To the brand, Cart.com wasn't one company yet. It was half a dozen.

## One login

Core Services fixed the front door first. We built a single identity across every acquired business on Auth0 for customers and Okta for staff (the two are now the same company), so a brand signed in once and was recognized everywhere.

## Brand HQ

Behind that login we built Brand HQ, the unified customer portal. It was early days: a brand could see its orders across Cart's businesses and manage its own account without calling anyone. It was meant to be the foundation that every other service would plug into.

## Built for the busy brands

The hard part wasn't the login page. It was volume. Some of our brands pushed out thousands of orders an hour, and Brand HQ had to keep up with all of them, from every business, as they happened.

So we built it as event-driven microservices on Kafka, running on Google Cloud. Each acquired business published its orders as events, and Brand HQ consumed them at whatever rate they arrived, so the busiest brands couldn't overwhelm it and a slow system at one business couldn't hold up the rest.

My job, as director, was the architecture and the team: six of us, with the systems of half a dozen companies to bring together.
