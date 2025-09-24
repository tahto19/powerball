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
        export: false,
      },
      freeTicket: {
        view: false,
        edit: false,
        export: false,
      },
      second_chance_site_defaults: {
        view: false,
        brows: false,
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
  async createSuperUser(id) {
    console.log("creating super usertype");
    let copy = { ...this.permissions };
    for (let key in copy) {
      for (let subKey in copy[key]) {
        if (typeof copy[key][subKey] === "boolean") {
          copy[key][subKey] = true;
        }
      }
    }
    let toInsert = {
      permissions: copy,
      Name: "admin type",
      createdBy: id,
    };
    let r = await UserType.create(toInsert);
    console.log("done creating super usertype");
    return r;
  }
  async updateSuperUser(id) {
    let copy = { ...this.permissions };
    for (let key in copy) {
      for (let subKey in copy[key]) {
        if (typeof copy[key][subKey] === "boolean") {
          copy[key][subKey] = true;
        }
      }
    }
    await UserType.update({ permissions: copy }, { where: { id } });
  }
}
export default new UserTypeClass();
