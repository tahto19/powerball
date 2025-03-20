export default function urlPatchChecker(fastify, opts, next) {
  fastify.addHook("preHandler", async (req, res) => {
    try {
      console.log(opts.json.no_permission, req.url);
      //   const bypass = opts.bypass.find((x) => {});
    } catch (err) {}
  });
  next();
}
