import "server-only";

import type { MarketProduct, Course } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getProducts, getAvailableCategories, searchProducts } from "@/lib/marketplace-data";
import { getCourses } from "@/lib/courses-data";
import {
  availabilityFor,
  primaryOffer,
  ctaLabel,
  money,
  COUNTRIES,
  COUNTRY_MAP,
} from "@/lib/marketplace";
import { resolveCourseUrl, courseCtaLabel } from "@/lib/courses";
import { siteUrl } from "@/lib/utils";
import { DEFAULT_BOT_COUNTRY } from "./config";
import { sendMessage, sendPhoto, sendChatAction, answerCallbackQuery } from "./api";
import {
  parseCommand,
  productCaption,
  productKeyboard,
  categoriesKeyboard,
  countryKeyboard,
  mainMenuKeyboard,
} from "./format";

/* ------------------------- Telegram update types ------------------------- */
type TgUser = { id: number; username?: string; first_name?: string };
type TgChat = { id: number };
type TgMessage = { chat: TgChat; from?: TgUser; text?: string };
type TgCallback = { id: string; from: TgUser; message?: TgMessage; data?: string };
export type TgUpdate = { message?: TgMessage; callback_query?: TgCallback };

const MAX_CARDS = 5;

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

/* --------------------------- product rendering -------------------------- */
function productBuy(product: MarketProduct, country: string) {
  const av = availabilityFor(product, country);
  const buy = av.hasLink ? av : primaryOffer(product);
  const priceText =
    (buy?.priceLabel && buy.priceLabel) ||
    (product.price != null ? money(product.price, product.currency || "EUR") : "See price");
  return {
    buyUrl: buy?.url || null,
    buyLabel: buy ? ctaLabel(buy) || "🛒 Buy now" : null,
    source: buy?.platform || null,
    priceText,
  };
}

async function sendProduct(chatId: string, product: MarketProduct, country: string) {
  const b = productBuy(product, country);
  const caption = productCaption({
    title: product.name,
    brand: product.brand,
    priceText: b.priceText,
    source: b.source ? `via ${b.source}` : null,
    availability: "Price may change — check on the store.",
  });
  await sendPhoto(
    chatId,
    product.imageUrl,
    caption,
    productKeyboard({
      buyUrl: b.buyUrl,
      buyLabel: b.buyLabel,
      siteUrl: `${siteUrl()}/nbnmarket/product/${product.slug}`,
    }),
  );
}

async function sendCourse(chatId: string, course: Course) {
  const url = resolveCourseUrl(course);
  const priceText = course.price != null ? money(course.price, course.currency || "USD") : "See price";
  const caption = productCaption({
    title: course.title,
    brand: course.instructor || course.provider,
    priceText,
    source: `via ${course.provider}`,
    availability: "Price may change — check on the provider.",
  });
  await sendPhoto(
    chatId,
    course.image,
    caption,
    productKeyboard({
      buyUrl: url,
      buyLabel: courseCtaLabel(course, "card"),
      siteUrl: `${siteUrl()}/courses/${course.slug}`,
    }),
  );
}

/* -------------------------------- flows --------------------------------- */
async function showWelcome(chatId: string, name?: string | null) {
  const hi = name ? `Hi ${name}! ` : "";
  await sendMessage(
    chatId,
    `${hi}Welcome to <b>NBN MARKET</b> 🛍️\n\nDiscover deals across electronics, home, fitness, courses and more — with the real buy link every time.\n\nUse the menu below, or:\n• /categories — browse by category\n• /deals — today's featured picks\n• /search &lt;words&gt; — find a product\n• /course — online courses\n• /country — set your delivery country`,
    { reply_markup: mainMenuKeyboard() },
  );
}

async function showCategories(chatId: string) {
  const cats = await getAvailableCategories();
  if (!cats.length) return sendMessage(chatId, "Categories are being added — check back shortly.");
  return sendMessage(chatId, "🗂️ <b>Browse a category</b>", {
    reply_markup: categoriesKeyboard(cats.map((c) => ({ slug: c.slug, name: c.name, icon: c.icon }))),
  });
}

async function showDeals(chatId: string, country: string) {
  let items = await getProducts({ featured: true, take: MAX_CARDS });
  if (!items.length) items = await getProducts({ trending: true, take: MAX_CARDS });
  if (!items.length) items = await getProducts({ take: MAX_CARDS });
  if (!items.length) return sendMessage(chatId, "No deals yet — check back soon.");
  await sendMessage(chatId, "🔥 <b>Today's picks</b>");
  for (const p of items) await sendProduct(chatId, p, country);
}

async function showCategory(chatId: string, slug: string, country: string) {
  const items = await getProducts({ category: slug, take: MAX_CARDS });
  if (!items.length) return sendMessage(chatId, "No products in that category yet.");
  for (const p of items) await sendProduct(chatId, p, country);
}

async function showSearch(chatId: string, q: string, country: string) {
  if (!q) return sendMessage(chatId, "Type what you're looking for, e.g. <code>/search air fryer</code>");
  const items = (await searchProducts(q)).slice(0, MAX_CARDS);
  if (!items.length) return sendMessage(chatId, `No matches for “${q}”. Try different words.`);
  await sendMessage(chatId, `🔎 Results for <b>${q}</b>`);
  for (const p of items) await sendProduct(chatId, p, country);
}

async function showCourses(chatId: string) {
  const courses = await getCourses({ take: MAX_CARDS, sort: "rating" });
  if (!courses.length) return sendMessage(chatId, "Courses are being added — check back soon.");
  await sendMessage(chatId, "🎓 <b>Top courses</b>");
  for (const c of courses) await sendCourse(chatId, c);
}

async function showCountry(chatId: string, current: string) {
  const name = COUNTRY_MAP[current]?.name || current;
  return sendMessage(chatId, `🌍 Deliver to: <b>${name}</b>\nPick a country to update pricing & availability:`, {
    reply_markup: countryKeyboard(COUNTRIES.map((c) => ({ code: c.code, name: c.name, flag: c.flag }))),
  });
}

/* ------------------------------ dispatchers ----------------------------- */
async function handleMessage(msg: TgMessage) {
  const chatId = String(msg.chat.id);
  const cmd = parseCommand(msg.text || "");
  const user = await getOrCreateUser(chatId, msg.from, cmd?.command === "start" ? cmd.args : undefined);
  await sendChatAction(chatId, "typing");

  if (!cmd) {
    // Bare text → treat as a search.
    return showSearch(chatId, (msg.text || "").trim(), user.country);
  }
  switch (cmd.command) {
    case "start":
      return showWelcome(chatId, user.firstName);
    case "categories":
      return showCategories(chatId);
    case "deals":
      return showDeals(chatId, user.country);
    case "search":
      return showSearch(chatId, cmd.args, user.country);
    case "course":
    case "courses":
      return showCourses(chatId);
    case "country":
      return showCountry(chatId, user.country);
    case "help":
      return showWelcome(chatId, user.firstName);
    default:
      return sendMessage(chatId, "Unknown command. Try /start.");
  }
}

async function handleCallback(cb: TgCallback) {
  const chatId = String(cb.message?.chat.id ?? cb.from.id);
  const user = await getOrCreateUser(chatId, cb.from);
  const data = cb.data || "";
  await answerCallbackQuery(cb.id);

  if (data === "menu:categories") return showCategories(chatId);
  if (data === "menu:deals") return showDeals(chatId, user.country);
  if (data === "menu:courses") return showCourses(chatId);
  if (data === "menu:country") return showCountry(chatId, user.country);
  if (data.startsWith("cat:")) return showCategory(chatId, data.slice(4), user.country);
  if (data.startsWith("country:")) {
    const code = data.slice(8).toUpperCase();
    if (COUNTRY_MAP[code]) {
      await prisma.telegramUser.update({ where: { chatId }, data: { country: code } });
      return sendMessage(chatId, `✅ Delivery country set to <b>${COUNTRY_MAP[code].name}</b>.`);
    }
  }
}

/** Entry point for the webhook. Never throws (Telegram would retry-storm). */
export async function handleUpdate(update: TgUpdate): Promise<void> {
  try {
    if (update.message) await handleMessage(update.message);
    else if (update.callback_query) await handleCallback(update.callback_query);
  } catch (err) {
    console.error("[telegram] handleUpdate error:", String(err));
  }
}
