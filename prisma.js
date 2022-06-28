const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  /** *********************************/
  /* SOFT DELETE MIDDLEWARE */
  /** *********************************/

  prisma.$use(async (params, next) => {
    if (params.action == 'delete') {
      params.action = 'update';
      params.args['data'] = {deleted_at: new Date().toISOString()};
    }
    if (params.action == 'deleteMany') {
      // Delete many queries
      params.action = 'updateMany';
      if (params.args.data != undefined) {
        params.args.data['deleted_at'] = new Date().toISOString();
      } else {
        params.args['data'] = {deleted: new Date().toISOString()};
      }
    }
    return next(params);
  });
}

main();


module.exports = prisma;
