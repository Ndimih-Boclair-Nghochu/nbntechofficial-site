import "server-only";

import type { MarketProduct, Course } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getProducts,
  getAllProducts,
  getAvailableCategories,
  searchProducts,
} from "@/lib/marketplace-data";
import { getAllCourses, searchCourses } from "@/lib/courses-data";
import {
  availabilityFor,
  primaryOffer,
  ctaLabel,
  money,
  categoryLabel,
  COUNTRIES,
  COUNTRY_MAP,
} from "@/lib/marketplace";
import { resolveCourseUrl, courseCtaLabel, courseDiscountPercent } from "@/lib/courses";
import { ensureRates, convert, roundPrice } from "@/lib/currency";
import { whatsappUrl, whatsappHelpText } from "@/lib/contact";
import { siteUrl } from "@/lib/utils";
import { DEFAULT_BOT_COUNTRY, getBotUsername } from "./config";
import { sendMessage, sendPhoto, sendChatAction, answerCallbackQuery } from "./api";
import {
  parseCommand,
  productCaption,
  productKeyboard,
  categoriesKeyboard,
  countryKeyboard,
  mainMenuKeyboard,
  pageNavKeyboard,
  shareIntentUrl,
  escapeHtml,
  type InlineKeyboard,
} from "./format";

/* ------------------------- Telegram update types ------------------------- */
type TgUser = { id: number; username?: string; first_name?: string };
type TgChat = { id: number };
type TgMessage = { chat: TgChat; from?: TgUser; text?: string };
type TgCallback = { id: string; from: TgUser; message?: TgMessage; data?: string };
export type TgUpdate = { message?: TgMessage; callback_query?: TgCallback };

const PAGE = 6;
const TASTER = 4;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function shareUrl(): string {
  return shareIntentUrl(getBotUsername(), "🛍️ Real deals on NBN MARKET — electronics, home, fitness, courses & more. Free on Telegram:");
}

/* ----------------------------- user storage ----------------------------- */
async function getOrCreateUser(chatId: string, from?: TgUser, startPayload?: string) {
  return prisma.telegramUser.upsert({
    where: { chatId },
    create: {
      chatId,
      username: from?.username ?? null,
      firstName: from?.first_name ?? null,
      country: DEFAULT_BOT_COUNTRY,
      startPayload: startPayload ?? null,
    },
    update: {
      username: from?.username ?? undefined,
      firstName: from?.first_name ?? undefined,
      ...(startPayload ? { startPayload } : {}),
      blocked: false,
    },
  });
}

/* --------------------------- card construction -------------------------- */
type Card = { image: string | null; caption: string; keyboard: InlineKeyboard };

/**
 * Localize a price to the user's country currency — identical logic to the
 * website's product card (convert via live FX, round, format). Requires
 * ensureRates() to have run first (we call it once per update).
 */
function localizedMoney(amount: number | null, from: string | null, country: string): string | null {
  if (amount == null) return null;
  const src = from || "EUR";
  const target = COUNTRY_MAP[country]?.currency;
  if (target && target !== src) {
    const c = convert(amount, src, target);
    if (c != null) return money(roundPrice(c), target);
  }
  return money(amount, src);
}

function productBuy(product: MarketProduct, country: string) {
  const av = availabilityFor(product, country);
  const buy = av.hasLink ? av : primaryOffer(product);
  const priceText =
    localizedMoney(product.price, product.currency, country) ||
    (buy?.priceLabel && buy.priceLabel) ||
    "See price on store";
  return { buyUrl: buy?.url || null, buyLabel: buy ? ctaLabel(buy) || "🛒 Buy now" : null, source: buy?.platform || null, priceText };
}

function ratingLine(rating: number | null, reviews: number | null): string | null {
  if (rating == null) return null;
  return `⭐ ${rating}${reviews ? ` (${Number(reviews).toLocaleString("en-US")} reviews)` : ""}`;
}
function blurbOf(text: string | null): string | null {
  return text ? text.replace(/\s+/g, " ").trim().slice(0, 140) : null;
}

function productCard(product: MarketProduct, country: string): Card {
  const b = productBuy(product, country);
  return {
    image: product.imageUrl,
    caption: productCaption({
      title: product.name,
      brand: product.brand,
      rating: ratingLine(product.rating, product.reviewCount),
      blurb: blurbOf(product.shortDescription),
      priceText: b.priceText,
      source: b.source ? `🛒 ${b.source}` : null,
      note: "Price may change — tap Buy for the live price.",
    }),
    keyboard: productKeyboard({
      buyUrl: b.buyUrl,
      buyLabel: b.buyLabel,
      siteUrl: `${siteUrl()}/nbnmarket/product/${product.slug}`,
      shareUrl: shareUrl(),
    }),
  };
}

function courseCard(course: Course, country: string): Card {
  const pct = courseDiscountPercent(course);
  return {
    image: course.image,
    caption: productCaption({
      title: course.title,
      brand: course.instructor || course.provider,
      rating: ratingLine(course.rating, course.reviewCount),
      blurb: blurbOf(course.shortDescription),
      priceText: localizedMoney(course.price, course.currency, country) || "See price",
      wasText: pct ? localizedMoney(course.originalPrice, course.currency, country) : null,
      discountText: pct ? `🔥 ${pct}% OFF` : null,
      source: `🎓 ${course.provider}`,
      note: "Price may change — tap to view on the provider.",
    }),
    keyboard: productKeyboard({
      buyUrl: resolveCourseUrl(course),
      buyLabel: courseCtaLabel(course, "card"),
      siteUrl: `${siteUrl()}/courses/${course.slug}`,
      shareUrl: shareUrl(),
    }),
  };
}

async function sendCard(chatId: string, card: Card) {
  await sendPhoto(chatId, card.image, card.caption, card.keyboard);
}

/* ------------------------------ pagination ------------------------------ */
async function sendProductPage(chatId: string, all: MarketProduct[], offset: number, country: string, moreKind: string) {
  const slice = all.slice(offset, offset + PAGE);
  for (const p of slice) {
    await sendCard(chatId, productCard(p, country));
    await sleep(250);
  }
  const shown = offset + slice.length;
  const remaining = Math.max(0, all.length - shown);
  await sendMessage(
    chatId,
    remaining > 0 ? `Showing ${shown} of ${all.length} products.` : `That's all ${all.length} — happy shopping! 🛍️`,
    { reply_markup: pageNavKeyboard(remaining > 0 ? `${moreKind}:${shown}` : null, remaining, shareUrl()) },
  );
}

async function sendCoursePage(chatId: string, all: Course[], offset: number, country: string, moreKind: string) {
  const slice = all.slice(offset, offset + PAGE);
  for (const c of slice) {
    await sendCard(chatId, courseCard(c, country));
    await sleep(250);
  }
  const shown = offset + slice.length;
  const remaining = Math.max(0, all.length - shown);
  await sendMessage(
    chatId,
    remaining > 0 ? `Showing ${shown} of ${all.length} courses.` : `That's all ${all.length} courses. 🎓`,
    { reply_markup: pageNavKeyboard(remaining > 0 ? `${moreKind}:${shown}` : null, remaining, shareUrl()) },
  );
}

/* -------------------------------- flows --------------------------------- */
function aboutText(hi: string): string {
  return (
    `${hi}Welcome to <b>NBN MARKET</b> 🛍️\n\n` +
    `Your shortcut to <b>products worth buying</b> — we hand-pick great deals across electronics, home &amp; kitchen, fitness, car, courses and more, and send you straight to the best place to buy (Amazon, Selar &amp; partners) with the real, current price.\n\n` +
    `✅ <b>Honest picks</b> — real specs &amp; ratings, never fake reviews\n` +
    `🌍 <b>Country-aware</b> — set where you shop with /country\n` +
    `🔔 <b>Fresh daily</b> — new deals added all the time\n\n` +
    `<b>How to use me</b>\n` +
    `• Tap a category below to see everything in it\n` +
    `• 🛍️ <b>All products</b> — browse the whole store\n` +
    `• /deals — today's top picks\n` +
    `• /search &lt;words&gt; — find anything (products &amp; courses)\n` +
    `• /course — online courses\n` +
    `• /country — set your delivery country\n\n` +
    `📣 Tap <b>Share NBN MARKET</b> to send great deals to a friend.`
  );
}

async function sendCategoryMenu(chatId: string) {
  const cats = await getAvailableCategories();
  const extra = [[
    { text: "🎓 Online Courses", callback_data: "menu:courses" },
    { text: "🛍️ All products", callback_data: "menu:all" },
  ]];
  const kb = cats.length
    ? categoriesKeyboard(cats.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon })), extra)
    : { inline_keyboard: extra };
  await sendMessage(chatId, "🗂️ <b>Shop by category</b> — tap one to see everything in it:", { reply_markup: kb });
}

async function showWelcome(chatId: string, name: string | null, country: string) {
  await sendMessage(chatId, aboutText(name ? `Hi ${escapeHtml(name)}! ` : ""), {
    reply_markup: mainMenuKeyboard(shareUrl()),
  });
  await sendCategoryMenu(chatId);
  const feat = await getProducts({ featured: true, take: TASTER });
  const picks = feat.length ? feat : await getProducts({ take: TASTER });
  if (picks.length) {
    await sendMessage(chatId, "🔥 <b>Top picks right now</b>");
    for (const p of picks) {
      await sendCard(chatId, productCard(p, country));
      await sleep(250);
    }
    await sendMessage(chatId, "Want to see everything?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🛍️ Browse all products", callback_data: "menu:all" }],
          [{ text: "🗂️ Categories", callback_data: "menu:categories" }, { text: "📣 Share", url: shareUrl() }],
        ],
      },
    });
  }
}

async function showDeals(chatId: string, country: string) {
  let items = await getProducts({ featured: true, take: 8 });
  if (!items.length) items = await getProducts({ trending: true, take: 8 });
  if (!items.length) items = await getProducts({ take: 8 });
  if (!items.length) return sendMessage(chatId, "No deals yet — check back soon.");
  await sendMessage(chatId, "🔥 <b>Today's top picks</b>");
  await sendProductPage(chatId, items, 0, country, "pgall");
}

async function showCategory(chatId: string, slug: string, country: string) {
  const items = await getProducts({ category: slug });
  if (!items.length) return sendMessage(chatId, "No products in that category yet. Try /categories.");
  const label = categoryLabel(slug) || slug;
  await sendMessage(chatId, `🗂️ <b>${escapeHtml(label)}</b> — ${items.length} product${items.length === 1 ? "" : "s"}`);
  await sendProductPage(chatId, items, 0, country, `pgcat:${slug}`);
}

async function showSearch(chatId: string, q: string, country: string) {
  if (!q) return sendMessage(chatId, "Type what you're looking for, e.g. <code>/search air fryer</code>");
  const isCoursey = /\bcourses?\b/i.test(q);
  const [products, foundCourses] = await Promise.all([searchProducts(q), searchCourses(q)]);
  let courses = foundCourses;
  if (isCoursey && courses.length < 6) courses = (await getAllCourses()).slice(0, 8);

  const prod = products.slice(0, 8);
  if (!prod.length && !courses.length) {
    const wa = whatsappUrl(whatsappHelpText(q));
    const text =
      `🔎 We couldn't find "<b>${escapeHtml(q)}</b>" on NBN MARKET yet.\n\n` +
      `🛡️ <b>Please don't risk getting scammed online.</b>\n` +
      `Message our team directly and we'll connect you with a <b>trusted, verified seller</b> for this product.\n\n` +
      `✅ Sellers we personally vet\n` +
      `✅ No upfront payments to strangers\n` +
      `✅ A real person replies, fast`;
    return sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "💬 Message our team on WhatsApp", url: wa }],
          [
            { text: "🗂️ Browse categories", callback_data: "menu:categories" },
            { text: "📣 Share", url: shareUrl() },
          ],
        ],
      },
    });
  }
  if (prod.length) {
    await sendMessage(chatId, `🔎 <b>Products</b> for “${escapeHtml(q)}”`);
    for (const p of prod) {
      await sendCard(chatId, productCard(p, country));
      await sleep(250);
    }
  }
  if (courses.length) {
    await sendMessage(chatId, `🎓 <b>Courses</b> for “${escapeHtml(q)}”`);
    for (const c of courses.slice(0, 6)) {
      await sendCard(chatId, courseCard(c, country));
      await sleep(250);
    }
  }
  await sendMessage(chatId, "Not quite it? Try /categories or 🛍️ /start.", { reply_markup: pageNavKeyboard(null, 0, shareUrl()) });
}

async function showCourses(chatId: string, country: string, offset = 0) {
  const all = await getAllCourses();
  if (!all.length) return sendMessage(chatId, "Courses are being added — check back soon.");
  if (offset === 0) await sendMessage(chatId, `🎓 <b>Online Courses</b> — ${all.length} available`);
  await sendCoursePage(chatId, all, offset, country, "pgcrs");
}

async function showAll(chatId: string, offset: number, country: string) {
  const all = await getAllProducts();
  if (!all.length) return sendMessage(chatId, "Products are being added — check back soon.");
  if (offset === 0) await sendMessage(chatId, `🛍️ <b>All products</b> — ${all.length} available`);
  await sendProductPage(chatId, all, offset, country, "pgall");
}

async function showCountry(chatId: string, current: string) {
  const name = COUNTRY_MAP[current]?.name || current;
  return sendMessage(chatId, `🌍 Deliver to: <b>${escapeHtml(name)}</b>\nPick a country to update pricing &amp; availability:`, {
    reply_markup: countryKeyboard(COUNTRIES.map((c) => ({ code: c.code, name: c.name, flag: c.flag }))),
  });
}

/* ------------------------------ dispatchers ----------------------------- */
async function handleMessage(msg: TgMessage) {
  const chatId = String(msg.chat.id);
  const cmd = parseCommand(msg.text || "");
  const user = await getOrCreateUser(chatId, msg.from, cmd?.command === "start" ? cmd.args : undefined);
  await sendChatAction(chatId, "typing");

  if (!cmd) return showSearch(chatId, (msg.text || "").trim(), user.country);
  switch (cmd.command) {
    case "start":
      return showWelcome(chatId, user.firstName, user.country);
    case "categories":
      return sendCategoryMenu(chatId);
    case "all":
    case "products":
      return showAll(chatId, 0, user.country);
    case "deals":
      return showDeals(chatId, user.country);
    case "search":
      return showSearch(chatId, cmd.args, user.country);
    case "course":
    case "courses":
      return showCourses(chatId, user.country, 0);
    case "country":
      return showCountry(chatId, user.country);
    case "help":
      return showWelcome(chatId, user.firstName, user.country);
    default:
      return sendMessage(chatId, "Unknown command. Try /start.");
  }
}

async function handleCallback(cb: TgCallback) {
  const chatId = String(cb.message?.chat.id ?? cb.from.id);
  const user = await getOrCreateUser(chatId, cb.from);
  const data = cb.data || "";
  await answerCallbackQuery(cb.id);
  await sendChatAction(chatId, "typing");

  if (data === "menu:all") return showAll(chatId, 0, user.country);
  if (data === "menu:deals") return showDeals(chatId, user.country);
  if (data === "menu:categories") return sendCategoryMenu(chatId);
  if (data === "menu:courses") return showCourses(chatId, user.country, 0);
  if (data === "menu:country") return showCountry(chatId, user.country);
  if (data.startsWith("cat:")) return showCategory(chatId, data.slice(4), user.country);
  if (data.startsWith("pgall:")) return showAll(chatId, Number(data.split(":")[1]) || 0, user.country);
  if (data.startsWith("pgcrs:")) return showCourses(chatId, user.country, Number(data.split(":")[1]) || 0);
  if (data.startsWith("pgcat:")) {
    const [, slug, off] = data.split(":");
    const items = await getProducts({ category: slug });
    return sendProductPage(chatId, items, Number(off) || 0, user.country, `pgcat:${slug}`);
  }
  if (data.startsWith("country:")) {
    const code = data.slice(8).toUpperCase();
    if (COUNTRY_MAP[code]) {
      await prisma.telegramUser.update({ where: { chatId }, data: { country: code } });
      return sendMessage(chatId, `✅ Delivery country set to <b>${escapeHtml(COUNTRY_MAP[code].name)}</b>. Prices now show for your region.`);
    }
  }
}

/** Entry point for the webhook. Never throws (Telegram would retry-storm). */
export async function handleUpdate(update: TgUpdate): Promise<void> {
  try {
    await ensureRates(); // load FX rates once so prices localize to the user's currency
    if (update.message) await handleMessage(update.message);
    else if (update.callback_query) await handleCallback(update.callback_query);
  } catch (err) {
    console.error("[telegram] handleUpdate error:", String(err));
  }
}
