import UserType from "../../../models/UserType.js";
import { randomLetters } from "../../../util/util.js";

class UserTypeClass {
  constructor() {
    this.permissions = {
      images: {
        view: false,
        add: false,
        edit: false,
      },
      administrator: {
        view: true,
        add: false,
        edit: false,
        export: false,
      },
      customer: {
        view: false,
        export: false,
      },
      game_maintenance: {
        view: false,
        export: false,
        add: false,
        edit: false,
        delete: false,
      },
      prize_list: {
        view: false,
        export: false,
        add: false,
        edit: false,
        delete: false,
      },
      raffle_draw: {
        view: false,
        export: false,
        draw: false,
      },
      scan: {
        view: false,
        export: false,
      },

      winners: {
        view: false,
        export: false,
        edit: false,
      },
      alphacode: {
        view: false,
        edit: false,
        add: false,
      },
      freeTicket: {
        view: false,
        edit: false,
      },
    };
  }
  async createUserType(id) {
    let toInsert = {
      permissions: this.permissions,
      Name: randomLetters(7),
      createdBy: id,
    };
    let r = await UserType.create(toInsert);

    return { toInsert, ...{ id: r.id } };
  }
  async updateUserType({ id, permissions }) {
    console.log(permissions, id);
    await UserType.update({ permissions }, { where: { id } });
  }
}
export default new UserTypeClass();
