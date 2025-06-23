export default function subsystem(fastify, opts, next) {
  fastify.addHook("onSend", async (req, reply, payload) => {
    try {
    } catch (error) {
      fastify.log.info(">> audit trail error:");
      fastify.log.error(error);
    }
  });

  next();
}
