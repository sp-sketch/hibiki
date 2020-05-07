/*
  Gets a server's config.
*/

const express = require("express");
const router = express.Router();

module.exports = bot => {
  router.get("/api/getconfig/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send({ error: "Unauthorized" });
    // Looks for managable guilds
    const managableguilds = req.user.guilds.filter(g => (g.permissions & 32) === 32);
    if (!managableguilds.find(g => g.id === req.params.id)) return res.status(403).send({ error: "No access to guild" });
    // Gets guildcfg
    const cfg = await bot.db.table("guildcfg").get(req.params.id);
    if (!cfg) return res.status(404).send({ error: "No config" });
    // Sends cfg
    res.send(cfg);
  });
  return router;
};
