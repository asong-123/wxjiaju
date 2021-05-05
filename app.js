// app.js
var mqtt = require("/utils/mqtt.js") //引入mqtt文件

//随机生成字符串，因为clientId你设成一个固定字符串的话，当你编译
//代码的时候就会以这个ID连接服务器，当预览或者真机调试的时候还是这个
//ID，就会发生ID冲突的问题，当时差点被这个不起眼的BUG整疯
function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
//连接配置
const options = {
  connectTimeout: 4000, //超时时间
  clientId: randomString(30), //随机生成ID
  username: 'admin', //用户名
  password: '123456', //密码
}

App({
  onLaunch() {
    this.mqttConnect()
  },
  mqttConnect() {
    let that = this
    var client = mqtt.connect('wx://www.xiaosen5257.com:8083/mqtt', options) //你自己的域名
    console.log(client)
    this.globalData.client = client;
    client.on('error', function(err){
      console.log('连接失败', err )
    })
    client.on('connect', (e) => {
      console.log(e)
      console.log('成功连接服务器!')
      client.subscribe('/mqtt/dev/info/receive', {
        qos: 0
      }, function (err) {
        console.log(err)
        if (!err) {
          console.log("订阅成功")
        }
      })
    })
    
    client.on('message', function (topic, message, packet) {
      that.globalData.mqttData = packet.payload.toString()
      console.log('憨憨', that.globalData.mqttData)
    })
  },
  watch: function(method){
    var obj = this.globalData;
    Object.defineProperty(obj, 'mqttData', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._mqttData = value;
        console.log('复制了！！！')
        method && method(value);
      },
      get: function(){
        return this._mqttData
      }
    })
  },
  globalData: {
    userInfo: null,
    cities:[],
    cityWeather:[],
    _mqttData: '',
    _mac: ''
  }
})