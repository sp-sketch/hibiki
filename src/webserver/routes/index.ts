/**
 * @file Index routes
 * @description Routings for the index page and it's redirects
 * @module webserver/routes/index
 */

import type { Profile } from "passport-discord";
import type { HibikiClient } from "../../classes/Client";
import { getAuthedUser } from "../../utils/webserver";
import express from "express";
import rateLimit from "express-rate-limit";
const router = express.Router();

const indexRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: "Too many requests in a short period of time.",
});

export function indexRoutes(bot: HibikiClient) {
  router.get("/", indexRateLimit, async (req, res) => {
    const user = req.isAuthenticated() ? getAuthedUser(req.user as Profile) : null;
    const userConfig = user ? await bot.db.getUserConfig(user?.id) : null;
    const locale = userConfig?.locale ? userConfig?.locale : bot.config.defaultLocale;

    res.render("index", {
      bot: bot,
      botAvatar: bot.user.dynamicAvatarURL("png", 512),
      page: req.url,
      user: user,
      locales:
        bot.config.defaultLocale === locale
          ? bot.localeSystem.locales[bot.config.defaultLocale]
          : { ...(bot.localeSystem.locales[bot.config.defaultLocale] as any), ...(bot.localeSystem.locales[locale] as any) },
    });
  });

  // Donate redirection
  router.get("/donate/", async (_req, res) => {
    res.redirect(301, `https://ko-fi.com/sysdotini`);
  });

  // Invite redirection
  router.get("/invite/", async (req, res) => {
    if (req.query.guild) {
      return res.redirect(
        301,
        `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=1581116663&guild_id=${req.query.guild}`,
      );
    }

    res.redirect(301, `https://discordapp.com/oauth2/authorize?&client_id=${bot.user.id}&scope=bot&permissions=1581116663`);
  });

  // Support redirection
  router.get("/support/", async (_req, res) => {
    res.redirect(301, "https://discord.gg/gZEj4sM");
  });

  // Translate redirection
  router.get("/translate/", async (_req, res) => {
    res.redirect(301, "https://translate.hibiki.app");
  });

  // GitHub redirection
  router.get("/github/", async (_req, res) => {
    res.redirect(301, "https://github.com/sysdotini/hibiki");
  });

  // Privacy redirection
  router.get("/privacy/", async (_req, res) => {
    res.redirect(301, "https://github.com/sysdotini/hibiki/blob/main/.github/PRIVACY_POLICY.md");
  });

  // Voting redirection
  router.get("/vote/", async (_req, res) => {
    res.redirect(301, "https://top.gg/bot/493904957523623936/vote");
  });

  // robots.txt
  router.get("/robots.txt", async (_req, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nCrawl-delay: 5\nDisallow: /public/\nDisallow: /auth/");
  });

  return router;
}
