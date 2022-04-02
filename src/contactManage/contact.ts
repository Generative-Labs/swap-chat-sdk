import { UserInfo } from '../types';

export class Contact {
  data: UserInfo;
  avatar?: string;
  title?: string;
  user_id?: string;
  constructor(data: UserInfo) {
    this.data = data;
    this._initialization(data);
  }

  /**
   * 默认属性挂载
   * @param data
   */
  _initialization = (data: UserInfo) => {
    this.avatar =
      data.twitter_avatar ||
      data.discord_avatar ||
      data.facebook_avatar ||
      data.opensea_avatar ||
      data.instagram_avatar ||
      '';
    this.title =
      data.twitter_username ||
      data.discord_username ||
      data.facebook_username ||
      data.opensea_username ||
      data.instagram_username ||
      '';
    this.user_id = data.user_id;
  };
}
