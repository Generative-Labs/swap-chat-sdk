export const EVENT_MAP = {
  'channel.created': true,
  // 获取channel list
  'channel.getList': true,
  // 改变active channel
  'channel.activeChange': true,
  // 'channel.deleted': true,
  // 'channel.hidden': true,
  // 'channel.kicked': true,
  // 'channel.muted': true,
  // 'channel.truncated': true,
  // 'channel.unmuted': true,
  // 更新channel
  'channel.updated': true,
  // 'channel.visible': true,
  // 改变contact
  'contact.activeChange': true,
  // 获取contactlist
  'contact.getList': true,
  //更新contactlist
  'contact.updateList': true,
  // 'health.check': true,
  // 'member.added': true,
  // 'member.removed': true,
  // 'member.updated': true,
  // 'message.deleted': true,
  // 接收到新消息
  'message.new': true,
  // 发送更新消息
  'message.updated': true,
  // 获取message list
  'message.getList': true,
  // 获取message thread list
  'message.getThreadList': true,
  // 打开当前romm下的thread列表
  'message.openAllThread': true,
  // 'message.read': true,
  // 'notification.channel_active_change': true,

  // 'notification.added_to_channel': true,
  // 'notification.channel_deleted': true,
  // 'notification.channel_mutes_updated': true,
  // 'notification.channel_truncated': true,
  // 'notification.invite_accepted': true,
  // 'notification.invite_rejected': true,
  // 'notification.invited': true,
  // 'notification.markRead': true,
  // 'notification.message_new': true,
  // 'notification.mutes_updated': true,
  // 'notification.removed_from_channel': true,
  // 'reaction.deleted': true,
  // 'reaction.new': true,
  // 'reaction.updated': true,
  // 'typing.start': true,
  // 'typing.stop': true,
  // 'user.banned': true,
  // 'user.deleted': true,
  // 'user.presence.changed': true,
  // 'user.unbanned': true,
  // 'user.updated': true,
  // 'user.watching.start': true,
  // 'user.watching.stop': true,

  // local events
  // 'connection.changed': true,
  // 'connection.recovered': true,
  // 'transport.changed': true,
};

const IS_VALID_EVENT_MAP_TYPE = { ...EVENT_MAP, all: true };

export const isValidEventType = (eventType: string): boolean =>
  IS_VALID_EVENT_MAP_TYPE[eventType as keyof typeof IS_VALID_EVENT_MAP_TYPE] || false;
