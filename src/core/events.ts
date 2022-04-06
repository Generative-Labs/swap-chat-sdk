export const EVENT_MAP = {
  'channel.created': true,
  'channel.deleted': true,
  'channel.hidden': true,
  'channel.kicked': true,
  'channel.muted': true,
  'channel.truncated': true,
  'channel.unmuted': true,
  'channel.updated': true,
  'channel.visible': true,
  'health.check': true,
  'member.added': true,
  'member.removed': true,
  'member.updated': true,
  'message.deleted': true,
  'message.new': true,
  'message.read': true,
  'message.updated': true,
  // 获取message list
  'message.getList': true,
  'notification.added_to_channel': true,
  'notification.channel_deleted': true,
  'notification.channel_mutes_updated': true,
  'notification.channel_truncated': true,
  'notification.invite_accepted': true,
  'notification.invite_rejected': true,
  'notification.invited': true,
  'notification.mark_read': true,
  'notification.message_new': true,
  'notification.mutes_updated': true,
  'notification.removed_from_channel': true,
  'reaction.deleted': true,
  'reaction.new': true,
  'reaction.updated': true,
  'typing.start': true,
  'typing.stop': true,
  'user.banned': true,
  'user.deleted': true,
  'user.presence.changed': true,
  'user.unbanned': true,
  'user.updated': true,
  'user.watching.start': true,
  'user.watching.stop': true,

  // local events
  'connection.changed': true,
  'connection.recovered': true,
  'transport.changed': true,
};

const IS_VALID_EVENT_MAP_TYPE = { ...EVENT_MAP, all: true };

export const isValidEventType = (eventType: string): boolean =>
  IS_VALID_EVENT_MAP_TYPE[eventType as keyof typeof IS_VALID_EVENT_MAP_TYPE] || false;
