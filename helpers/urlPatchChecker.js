export default function urlPatchChecker(fastify, opts, next) {
  fastify.addHook("preHandler", async (req, res) => {
    try {
      //   const bypass = opts.bypass.find((x) => {});
    } catch (err) {}
  });
  next();
}
