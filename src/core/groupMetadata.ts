/**
 *  Code by Ahosall
 * 
 *  https://github.com/Ahosall/
 * 
 */

import { GroupMetadata } from "@whiskeySockets/baileys";

type TGroup = {
  id: string;
  title: string;
  createdBy: string;
  createdAt: number;
  restrict: boolean;
  admins: Array<string>;
  members: Array<string>;
};

export class Group {
  props: TGroup;

  constructor(group: GroupMetadata) {
    this.props = this.normalizeMetadata(group);
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get restrict() {
    return this.props.restrict;
  }

  get admins() {
    return this.props.admins;
  }

  get members() {
    return this.props.members;
  }

  private normalizeMetadata = (data: GroupMetadata): TGroup => {
    let nData: TGroup = {
      id: data.id,
      title: data.subject,
      createdBy: data.owner,
      createdAt: data.creation,
      restrict: data.restrict,
      admins: [],
      members: [],
    };

    data.participants.filter((p) => {
      if (p.admin == null) {
        nData.members.push(p.id);
      } else if (p.admin == "admin" || p.admin == "superadmin") {
        nData.admins.push(p.id);
      }
    });

    return nData;
  };
}