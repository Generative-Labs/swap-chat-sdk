class Socket {
  // WebSocket实例
  ws: WebSocket | null;
  // token
  token: string;
  // 开启标识
  socket_open: boolean;
  // 是否自动重连
  is_reonnect: boolean;
  // 重连次数
  reconnect_count: number;
  // 已发起重连次数
  reconnect_current: number;
  // 重连timer
  reconnect_timer: any;
  // 重连频率
  reconnect_interval: number;

  constructor(token: string) {
    this.ws = null;
    this.token = token;
    this.socket_open = false;
    this.is_reonnect = true;
    this.reconnect_count = 3;
    this.reconnect_current = 1;
    this.reconnect_timer = null;
    this.reconnect_interval = 3000;
  }

  /**
   * 初始化连接
   */
  init = () => {
    if (!('WebSocket' in window)) {
      throw new Error('Browser not supported WebSocket');
    }
    console.log(this.ws, 13123123123);
    if (this.ws) {
      return this.ws;
    }
    this.ws = new WebSocket(`wss://newbietown.com/ws?token=${this.token}`);

    this.ws.onmessage = (e) => {
      this.receive(e);
    };

    // 连接断开
    this.ws.onclose = (e) => {
      console.log('连接已断开');
      console.log('connection closed (' + e.code + ')');
      this.socket_open = false;

      // 需要重新连接
      if (this.is_reonnect) {
        this.reconnect_timer = setTimeout(() => {
          // 超过重连次数
          if (this.reconnect_current > this.reconnect_count) {
            clearTimeout(this.reconnect_timer);
            return;
          }
          // 记录重连次数
          this.reconnect_current++;
          this.reconnect();
        }, this.reconnect_interval);
      }
    };

    // 连接成功
    this.ws.onopen = () => {
      console.log('连接成功');
      this.socket_open = true;
      this.is_reonnect = true;
    };

    // 连接发生错误
    this.ws.onerror = function () {
      throw new Error('WebSocket Connection error');
    };
  };

  /**
   * 发送消息
   * @param {*} data 发送数据
   * @param {*} callback 发送后的自定义回调函数
   */
  send(data: any, callback?: (() => void) | undefined) {
    if (!this.ws) {
      throw new Error('websocket Initialization failed');
    }
    console.log(data);
    console.log(this.ws);
    console.log(this.ws.OPEN, 'OPEN');
    console.log(this.ws.CONNECTING, 'CONNECTING');
    console.log(this.ws.CLOSED, 'CLOSED');
    // 开启状态直接发送
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify(data));
      if (callback) {
        callback();
      }

      // 正在开启状态，则等待1s后重新调用
    } else if (this.ws.readyState === this.ws.CONNECTING) {
      setTimeout(() => {
        this.send(data, callback);
      }, 1000);

      // 未开启，则等待1s后重新调用
    } else {
      this.init();
      setTimeout(() => {
        this.send(data, callback);
      }, 1000);
    }
  }

  /**
   * 接收消息
   * @param {*} message 接收到的消息
   */
  receive(message: any) {
    var params = JSON.parse(message.data || '{}');

    if (params.kind != 0) {
      console.log('收到服务器内容：', message.data);
    }

    if (params == undefined) {
      console.log('收到服务器空内容');
      return false;
    }
  }

  /**
   * 主动关闭连接
   */
  close() {
    console.log('主动断开连接');
    this.is_reonnect = false;
    this.close();
  }

  /**
   * 重新连接
   */
  reconnect() {
    console.log('发起重新连接', this.reconnect_current);
    if (this.ws && this.socket_open) {
      this.ws.close();
    }

    this.init();
  }
}

export default Socket;
