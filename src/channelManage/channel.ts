import { MessageResponse, UserInfoInterface } from '../types';
import { dateFormat } from '../core/utils';

export class Channel {
  latest_msg?: MessageResponse;
  members?: UserInfoInterface[];
  room_id: string;

  constructor(room_id: string, latest_msg?: MessageResponse, members?: UserInfoInterface[]) {
    this.room_id = room_id;
    this.latest_msg = latest_msg;
    this.members = members;
  }

  formatMessageData() {
    let latestMsg = '',
      displayTitle = '',
      avatarUrl = '',
      updatedAt: string = '';
    if (this.latest_msg && Object.keys(this.latest_msg).length > 0) {
      latestMsg = this.latest_msg.msg_contents;
      updatedAt = dateFormat(this.latest_msg.created_at / 1000000, 'm/d');
    }
    if (this.members && this.members.length === 1) {
      displayTitle = this.members[0].nick_name;
      avatarUrl =
        this.members[0].twitter_avatar ||
        this.members[0].discord_avatar ||
        this.members[0].facebook_avatar ||
        this.members[0].opensea_avatar ||
        this.members[0].instagram_avatar ||
        '';
    }
    if (this.members && this.members.length > 1) {
      displayTitle =
        this.members
          .slice(0, 3)
          .map((memberItem) => memberItem.nick_name)
          .join(',') + '...';
      avatarUrl =
        this.members
          .slice(0, 3)
          .map(
            (memberItem) =>
              memberItem.twitter_avatar ||
              memberItem.discord_avatar ||
              memberItem.facebook_avatar ||
              memberItem.opensea_avatar ||
              memberItem.instagram_avatar,
          )
          .join(',') + '...';
    }
    return {
      latestMsg,
      displayTitle,
      avatarUrl,
      updatedAt,
    };
  }
}
